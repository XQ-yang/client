<template>
  <div>
    <el-card shadow="hover">
      <el-table v-loading="loading" element-loading-text="Loading..." :height="tableHeight" stripe :data="tableData" style="width: 100%">
        <el-table-column prop="id" align="center" label="ID" min-width="50"/>
        <el-table-column prop="name" align="center" label="文件名" min-width="180"/>
        <el-table-column prop="type" align="center" label="类型" min-width="100"/>
        <el-table-column align="center" label="图片" min-width="200">
          <template #default="scope">
            <div class="demo-image__preview">
              <el-image fit="scale-down" style="width: 100px; height: 100px" v-show="scope.row.type === 'png'"
                        :src="scope.row.url" :preview-src-list="scope.row.url"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="size" align="center" label="大小" min-width="100">
          <template #default="scope">
            {{ (scope.row.size / 1024).toFixed(2) }} KB
          </template>
        </el-table-column>
        <el-table-column prop="storeType" align="center" label="存储方式" min-width="150"/>
        <el-table-column prop="createTime" align="center" label="创建时间" min-width="150"/>
        <el-table-column prop="modifyTime" align="center" label="修改时间" min-width="150"/>
        <el-table-column fixed="right" align="center" label="操作" min-width="150">
          <template #default="scope">
            <el-button link type="primary" @click="downloadFile(scope.row.name, scope.row.storeType)">下载</el-button>
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
        console.log(res)
        if (res.code === 2000) {
          this.tableData = res.data.records
          this.total = res.data.total
          this.loading = false
          setTimeout(() => {
            this.loading = false
          }, 5000)
        }
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


    downloadFile(fileName, storeType) {
      window.open("http://localhost:8099/aliyunoss/download?fileName=" + fileName + "&storeType=" + storeType)
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
      ).then(() =>{
        request.get("aliyunoss/delete/" + id).then(res =>{
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
.demo-pagination-block {
  margin-top: 20px;
}

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
