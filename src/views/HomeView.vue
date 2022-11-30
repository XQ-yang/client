<template>
  <div>
    <el-card shadow="hover">
      <el-table v-loading="loading" element-loading-text="Loading..." :height="tableHeight" stripe :data="tableData"
                style="width: 100%">
        <el-table-column prop="id" align="center" label="ID" min-width="50"/>
        <el-table-column prop="name" align="center" label="文件名" min-width="180"/>
        <el-table-column prop="type" align="center" label="类型" min-width="100"/>
        <el-table-column align="center" label="图片" min-width="200">
          <template #default="scope">
            <div class="demo-image__preview">
              <el-image
                  v-show="scope.row.type === '图片'"
                  fit="contain"
                  style="width: 100px; height: 100px"
                  :src="scope.row.url"
                  :preview-src-list="[scope.row.url]"
                  :preview-teleported="true"
                  :hide-on-click-modal="true"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="size" align="center" label="大小" min-width="100">
          <template #default="scope">
            {{ (scope.row.size / 1024).toFixed(2) }} KB
          </template>
        </el-table-column>
        <el-table-column prop="storeType" align="center" label="存储方式" min-width="150"/>
        <el-table-column prop="createTime" align="center" label="创建时间" min-width="160"/>
        <el-table-column prop="modifyTime" align="center" label="修改时间" min-width="160"/>
        <el-table-column fixed="right" align="center" label="操作" min-width="200">
          <template #default="scope">
            <el-button link type="primary" @click="downloadFile(scope.row.name, scope.row.type, scope.row.storeType)">
              下载
            </el-button>
            <el-button link type="primary" @click="downloadByOpen(scope.row.name, scope.row.type, scope.row.storeType)">
              新窗口下载
            </el-button>
            <el-button link type="success" @click="click">查看</el-button>
            <el-button link type="danger" @click="deleteById(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="demo-pagination-block">
        <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 30, 40]"
            :disabled="disabled"
            :background="background"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import request from "@/libs/request";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: 'HomeView',
  data() {
    return {
      loading: true,
      tableHeight: 700,
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      disabled: false,
      background: false,
    }
  },

  created() {
    this.getList()
  },

  methods: {
    click() {
      alert("hello, world!")
    },

    getList() {
      request.get("/aliyunoss/mediaList", {
        params: {
          pageNum: this.currentPage,
          pageSize: this.pageSize
        }
      }).then(res => {
        if (res.code === 2000) {
          this.tableData = res.data.records
          this.total = res.data.total
          this.loading = false
          setTimeout(() => {
            this.loading = false
          }, 5000)
        }
      }).catch(() => {
        setTimeout(() => {
          this.loading = false
        }, 5000)
      })
    },

    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },

    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },


    downloadFile(fileName, type, storeType) {
      request.get('/aliyunoss/download', {
        params: {
          fileName, type, storeType
        },
        responseType: 'blob'
      }).then(res => {
        console.log(res)
        //流的转储属于浅拷贝
        const content = res.data;
        const blob = new Blob([content]); //构造一个blob对象来处理数据

        const fileName = decodeURIComponent(res.headers['fileName']);

        //对于<a>标签，只有 Firefox 和 Chrome（内核） 支持 download 属性
        //IE10以上支持blob但是依然不支持download
        if ("download" in document.createElement("a")) {
          //支持a标签download的浏览器
          const link = document.createElement("a"); //创建a标签
          link.download = fileName; //a标签添加属性
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          document.body.appendChild(link);
          link.click(); //执行下载
          URL.revokeObjectURL(link.href); //释放url
          document.body.removeChild(link); //释放标签
        } else {
          //其他浏览器
          navigator.msSaveBlob(blob, fileName);
        }
      })
          .catch(err => {
            console.log(err);
            this.$message.error("下载文件失败");
          });
    },

    downloadByOpen(fileName, type, storeType) {

      let filePath = "http://localhost:8099/aliyunoss/download?fileName=" + fileName + "&type=" + type + "&storeType=" + storeType
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = filePath

      document.body.appendChild(link)
      link.click()
      // window.open("http://localhost:8099/aliyunoss/download?fileName=" + fileName + "&type=" + type + "&storeType=" + storeType)
    },

    deleteById(id) {
      ElMessageBox.confirm(
          '确定删除这条数据吗?',
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(() => {
        request.get("aliyunoss/delete/" + id).then(res => {
          if (res.code === 2000) {
            ElMessage.success("删除成功！")
            this.getList()
          }
        })
      })

    },
  }


}
</script>
<style>
.demo-image__error .image-slot {
  font-size: 30px;
}

.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}

.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}
</style>
