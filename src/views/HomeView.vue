<template>
  <div>
    <el-card>
      <el-table stripe :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="ID" min-width="50"/>
        <el-table-column prop="name" label="文件名" min-width="150"/>
        <el-table-column prop="type" label="类型" min-width="100"/>
        <el-table-column prop="size" label="大小" min-width="100">
          <template #default="scope">
            {{(scope.row.size / 1024).toFixed(2)}} KB
          </template>
        </el-table-column>
        <el-table-column prop="url" label="链接" min-width="600">
          <template #default="scope">
            <a :href="scope.row.url">{{scope.row.url}}</a>
<!--            <el-button type="primary" @click="downloadFile(scope.row.newName)">下载</el-button>-->
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="140"/>
        <el-table-column prop="modifyTime" label="修改时间" min-width="140"/>
        <el-table-column fixed="right" label="Operations" min-width="120">
          <template #default>
            <el-button link type="primary" size="small" @click="click"
            >Detail
            </el-button>
            <el-button link type="danger" size="small">Delete</el-button>
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
import axios from 'axios'

export default {
  name: 'HomeView',
  data() {
    return {
      tableData: [],
      total: 40,
      currentPage: 1,
      pageSize: 10,
      disabled: false,
      background: false
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
      axios.get("http://localhost:8099/aliyunoss/toDownload").then(res => {
        console.log(res)
        if (res.data.code === "200") {
          this.tableData = res.data.data
          this.total = res.data.data.length
        }
      })
    },

    handleSizeChange(val) {
      this.pageSize = val
    },

    handleCurrentChange(val) {
      this.currentPage = val
    },


    downloadFile(fileName) {
      axios.get("http://localhost:8099/aliyunoss/download?fileName="+fileName ).then(res => {
        console.log(res)
        this.$message.success("下载成功！")
      })
    },
  }


}
</script>
<style>
.demo-pagination-block {
  margin-top: 20px;
}
</style>
