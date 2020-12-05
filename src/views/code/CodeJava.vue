<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="220px">
      <el-form-item label="选择数据库" prop="databaseName">
        <el-select v-model="form.databaseName" placeholder="选择数据库" @change="getTables">
          <el-option
            v-for='item in selectDatabaseData'
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择需要生成的表" prop="tableName">
        <el-select v-model="form.tableName" placeholder="选择数据表">
          <el-option
            v-for='item in selectTableData'
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否生成Controller" prop="isGeneratorController">
        <el-select v-model="form.isGeneratorController" placeholder="请选择是否生成Controller">
          <el-option label="是" value="1"></el-option>
          <el-option label="否" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="输入Controller类名" prop="controllerName">
        <el-row>
          <el-col :span="10">
            <el-input type="text" v-model="form.controllerName" placeholder="请输入Controller类名"/>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="是否生成Service" prop="isGeneratorService">
        <el-select v-model="form.isGeneratorService" placeholder="请选择是否生成Service">
          <el-option label="是" value="1"></el-option>
          <el-option label="否" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="输入Service类名" prop="serviceName">
        <el-row>
          <el-col :span="10">
            <el-input type="text" v-model="form.serviceName" placeholder="请输入Service类名"/>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="实体名称" prop="entityName">
        <el-row>
          <el-col :span="10">
            <el-input type="text" v-model="form.entityName" placeholder="请输入实体名称"/>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="请选择Mapper需要生成的方法" prop="mapperNames">
        <el-checkbox-group
          v-model="form.mapperNames">
          <el-checkbox  label="insertSelective">条件插入</el-checkbox>
          <el-checkbox  label="insertBatch">批量插入</el-checkbox>
          <el-checkbox  label="deleteSelective">条件删除</el-checkbox>
          <el-checkbox  label="deleteBatchSelective">批量条件删除</el-checkbox>
          <el-checkbox  label="updateSelective">条件更新</el-checkbox>
          <el-checkbox  label="updateBatchSelective">批量条件更新</el-checkbox>
          <el-checkbox  label="selectSelective">条件查询</el-checkbox>
          <el-checkbox  label="selectBatchSelective">批量条件查询</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">生成Java代码</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { listDataBases, listTables, generatorJava } from '@/api/code'
import axios from 'axios'

export default {
  data() {
    const validateControllerName = (rule, value, callback) => {
      if (this.form.isGeneratorController.indexOf(1) !== -1) {
        if (!value) {
          callback(new Error('请输入Controller类名'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const validateServiceName = (rule, value, callback) => {
      if (this.form.isGeneratorService.indexOf(1) !== -1) {
        if (!value) {
          callback(new Error('请输入Service类名'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      form: {
        databaseName: '',
        tableName: '',
        controllerName: '',
        isGeneratorController: '',
        serviceName: '',
        isGeneratorService: '',
        entityName: '',
        mapperNames: []
      },
      listTablesParam: {
        databaseName: ''
      },
      selectDatabaseData: [],
      selectTableData: [],
      rules: {
        databaseName: [
          { required: true, message: '请选择数据库', trigger: 'change' }
        ],
        tableName: [
          { required: true, message: '请选择数据表', trigger: 'change' }
        ],
        entityName: [
          { required: true, message: '请输入实体名', trigger: 'blur' }
        ],
        isGeneratorController: [
          { required: true, message: '请选择是否生成Controller', trigger: 'change' }
        ],
        controllerName: [
          { validator: validateControllerName, trigger: 'blur' }
        ],
        serviceName: [
          { validator: validateServiceName, trigger: 'blur' }
        ],
        isGeneratorService: [
          { required: true, message: '请选择是否生成Service', trigger: 'change' }
        ],
        mapperNames: [
          { type: 'array', required: true, message: '请至少选择一项方法生成', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    listDataBases({}).then(response => {
      if (response.code === 200) {
        this.selectDatabaseData = response.data
      } else {
        this.$message.error('获取数据表列表失败！请稍后再试')
      }
    })
  },
  methods: {
    getTables() {
      this.listTablesParam.databaseName = this.form.databaseName
      listTables(this.listTablesParam).then(res => {
        if (res.code === 200) {
          this.selectTableData = res.data
        } else {
          this.$message.error('获取数据表列表失败！')
        }
      })
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          generatorJava(this.form).then(res => {
            if (res.code === 200) {
              this.$message.success('success')
            }
          })
        } else {
          return false
        }
      })
    },
    // 下载附件
    handleDownload(url, fileName, mime) {
      axios.get(url, { responseType: 'blob' })
        .then(res => {
          const blob = new Blob([res.data], { type: mime })
          // 注: mime类型必须整正确, 否则下载的文件会损坏
          if (window.navigator && window.navigator.msSaveOrOpenBlob) { // 兼容IE
            // eslint-disable-next-line no-undef
            window.navigator.msSaveOrOpenBlob(blob, element.original_name)
          } else {
            const downloadElement = document.createElement('a')
            downloadElement.href = window.URL.createObjectURL(blob) // 创建一个DOMString
            downloadElement.download = fileName
            downloadElement.click()
            window.URL.revokeObjectURL(blob) // 释放 DOMString  ,解除内存占用
          }
        })
        .catch(error => {
          console.error(error)
        })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

