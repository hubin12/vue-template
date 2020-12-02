<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules"  label-width="120px">
      <el-form-item label="生成表的名称" prop="tableName">
        <el-input v-model="form.tableName"  placeholder="输入生成表的名称"/>
      </el-form-item>
      <span style="font-size: 8px; color: red; margin-left: 120px; font-style: italic;">*暂只支持Mysql</span>
      <el-form-item label="选择数据库类型" prop="databaseType">
        <el-select v-model="form.databaseType" placeholder="选择数据库类型">
          <el-option label="Mysql" value="MySql" />
        </el-select>
      </el-form-item>
      <el-form-item label="选择数据库" prop="databaseName">
        <el-select v-model="form.databaseName" placeholder="选择数据库">
          <el-option
            v-for='item in dataBaseData'
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="addField" type="primary">添加字段</el-button>
      </el-form-item>
      <el-form-item prop="fields">
        <el-table
          v-if="form.fields.length > 0"
          stripe
          border
          width="100%"
          :data="form.fields">
          <el-table-column
            align="center"
            fixed
            prop="fieldName"
            label="字段名称"
            width="200">
          </el-table-column>
          <el-table-column
            align="center"
            prop="fieldType"
            label="数据类型"
            width="240">
          </el-table-column>
          <el-table-column
            align="center"
            prop="fieldLength"
            label="字段长度"
            width="180">
          </el-table-column>
          <el-table-column
            align="center"
            prop="fieldDecimalLength"
            label="小数点长度"
            width="140">
          </el-table-column>
          <el-table-column
            align="center"
            prop="fieldCanBeNull"
            label="是否可以为空"
            :formatter="formatterData"
            width="140">
          </el-table-column>
          <el-table-column
            align="center"
            prop="fieldIsKey"
            label="是否为主键"
            :formatter="formatterData"
            width="140">
          </el-table-column>
          <el-table-column
            align="center"
            prop="fieldDescription"
            label="字段描述">
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            label="操作"
            width="80">
            <template slot-scope="scope">
              <el-button @click="deleteRow(scope.row)" type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-dialog title="添加字段" :visible.sync="showAddDialog" width="40%" @close="closeAddDialog">
        <el-form ref="fieldForm" :model="field" :rules="rules">
          <el-form-item
            label='字段名称:'
            prop="fieldName">
            <el-row >
              <el-col :span="12">
                <el-input v-model="field.fieldName"  placeholder="输入字段名称"/>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item
            label='数据类型:'
            prop="fieldType">
            <el-row >
              <el-col :span="8">
                <el-select v-model="field.fieldType" placeholder="选择数据类型">
                  <el-option label="TINYINT" value="TINYINT" />
                  <el-option label="INT" value="INT" />
                  <el-option label="BIGINT" value="BIGINT" />
                  <el-option label="FLOAT" value="FLOAT" />
                  <el-option label="DOUBLE" value="DOUBLE" />
                  <el-option label="DECIMAL" value="DECIMAL" />
                  <el-option label="DATE" value="DATE" />
                  <el-option label="DATETIME" value="DATETIME" />
                  <el-option label="TIME" value="TIME" />
                  <el-option label="TIMESTAMP" value="TIMESTAMP" />
                  <el-option label="CHAR" value="CHAR" />
                  <el-option label="VARCHAR" value="VARCHAR" />
                  <el-option label="TEXT" value="TEXT" />
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item
            label='字段长度:'
            prop="fieldLength">
            <el-row >
              <el-col :span="12">
                <el-input v-model="field.fieldLength"  placeholder="输入字段长度"/>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item
            label='小数点长度:'
            prop="fieldDecimalLength">
            <el-row>
              <el-col :span="12">
                <el-input v-model="field.fieldDecimalLength"  placeholder="输入小数点长度"/>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item
            label='是否可以为空:'
            prop="fieldCanBeNull">
            <el-row>
              <el-col :span="8">
                <el-select v-model="field.fieldCanBeNull" placeholder="是否可以为空">
                  <el-option label="是" value="1" />
                  <el-option label="否" value="0" />
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item
            label='是否为主键:'
            prop="fieldIsKey">
            <el-row>
              <el-col :span="8">
                <el-select v-model="field.fieldIsKey" placeholder="是否为主键">
                  <el-option label="是" value="1" />
                  <el-option label="否" value="0" />
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item
            label='输入字段注释:'
            prop="fieldDescription">
            <el-row>
              <el-col :span="12">
                <el-input v-model="field.fieldDescription"  placeholder="输入字段注释"/>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeAddDialog">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
      <el-form-item>
        <el-button type="success" @click="onSubmit">生成SQL脚本</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { generatorSql, listDataBases } from '@/api/code'
import axios from 'axios'

export default {
  data() {
    return {
      form: {
        tableName: '',
        databaseType: '',
        databaseName: '',
        fields: []
      },
      dataBaseData: [],
      field: {
        fieldName: '',
        fieldType: '',
        fieldLength: '',
        fieldDecimalLength: '',
        fieldCanBeNull: '',
        fieldIsKey: '',
        fieldDescription: ''
      },
      showAddDialog: false,
      rules: {
        tableName: [
          { required: true, message: '请输入表名称', trigger: 'blur' }
        ],
        databaseType: [
          { required: true, message: '请选择数据库类型', trigger: 'change' }
        ],
        databaseName: [
          { required: true, message: '请选择数据库', trigger: 'change' }
        ],
        fieldName: [
          { required: true, message: '请输入字段名称', trigger: 'blur' }
        ],
        fieldType: [
          { required: true, message: '请选择字段类型', trigger: 'change' }
        ],
        fieldLength: [
          { required: true, message: '请输入字段长度', trigger: 'blur' }
        ],
        fieldDecimalLength: [
          { required: true, message: '请输入小数点长度', trigger: 'blur' }
        ],
        fieldCanBeNull: [
          { required: true, message: '请选择是否可以为空', trigger: 'change' }
        ],
        fieldIsKey: [
          { required: true, message: '请选择是否为主键', trigger: 'change' }
        ],
        fieldDescription: [
          { required: true, message: '请输入字段注释', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    listDataBases({}).then(res => {
      if (res.code === 200) {
        this.dataBaseData = res.data
      } else {
        this.$message.error('获取数据库列表失败！')
      }
    })
  },
  methods: {
    formatterData(row, column, cellValue) {
      if (cellValue.indexOf(1) !== -1) {
        return '是'
      } else {
        return '否'
      }
    },
    submit() {
      this.$refs.fieldForm.validate((valid) => {
        if (valid) {
          const data = {}
          data.fieldName = this.field.fieldName
          data.fieldType = this.field.fieldType
          data.fieldLength = this.field.fieldLength
          data.fieldDecimalLength = this.field.fieldDecimalLength
          data.fieldCanBeNull = this.field.fieldCanBeNull
          data.fieldIsKey = this.field.fieldIsKey
          data.fieldDescription = this.field.fieldDescription
          this.form.fields.push(data)
          this.closeAddDialog()
        } else {
          return false
        }
      })
    },
    closeAddDialog() {
      this.showAddDialog = false
      this.field.fieldName = ''
      this.field.fieldType = ''
      this.field.fieldLength = ''
      this.field.fieldDecimalLength = ''
      this.field.fieldCanBeNull = ''
      this.field.fieldIsKey = ''
      this.field.fieldDescription = ''
    },
    addField() {
      this.field.fieldName = ''
      this.field.fieldType = ''
      this.field.fieldLength = ''
      this.field.fieldDecimalLength = ''
      this.field.fieldCanBeNull = ''
      this.field.fieldIsKey = ''
      this.field.fieldDescription = ''
      this.showAddDialog = true
    },
    deleteRow(row) {
      const index = this.form.fields.indexOf(row)
      if (this.form.fields.includes(row)) {
        this.form.fields.splice(index, 1)
      }
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          generatorSql(this.form).then(response => {
            if (response.code === 200) {
              this.handleDownload('/dev-api/api/download?path=' + response.data, response.data, 'application/force-download')
            } else {
              this.$message.error(response.message)
              return
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

