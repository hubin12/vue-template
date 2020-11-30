<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="生成表的名称">
        <el-input v-model="form.name"  placeholder="输入生成表的名称"/>
      </el-form-item>
      <el-form-item label="选择数据库">
        <el-select v-model="form.type" placeholder="选择数据库类型">
          <el-option label="Mysql" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="addField" type="primary">添加字段</el-button>
      </el-form-item>
      <el-form-item
        v-for="(field, index) in form.fields"
        :label="'字段名称:'+ (index+1)"
        :key="index"
        :prop="form.fields[index].fieldName">
        <el-row style="margin-bottom: 10px;">
          <el-col :span="12">
            <el-input v-model="field.fieldName"  placeholder="输入字段名称"/>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item
        v-for="(field, index) in form.fields"
        :label="'数据类型:'+(index+1)"
        :key="index"
        :prop="form.fields[index].fieldType">
        <el-row style="margin-bottom: 10px;">
          <el-col :span="8">
            <el-select v-model="field.fieldType" placeholder="选择数据类型">
              <el-option label="TINYINT" value="1" />
              <el-option label="INT" value="2" />
              <el-option label="BIGINT" value="3" />
              <el-option label="FLOAT" value="4" />
              <el-option label="DOUBLE" value="5" />
              <el-option label="DECIMAL" value="6" />
              <el-option label="DATE" value="7" />
              <el-option label="DATETIME" value="8" />
              <el-option label="TIME" value="9" />
              <el-option label="TIMESTAMP" value="10" />
              <el-option label="CHAR" value="11" />
              <el-option label="VARCHAR" value="12" />
              <el-option label="TEXT" value="13" />
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item
        v-for="(field, index) in form.fields"
        :label="'字段长度:'+(index+1)"
        :key="index"
        :prop="form.fields[index].fieldLength">
        <el-row style="margin-bottom: 10px;">
            <el-col :span="12">
              <el-input v-model="field.fieldLength"  placeholder="输入字段长度"/>
            </el-col>
          </el-row>
      </el-form-item>
      <el-form-item
        v-for="(field, index) in form.fields"
        :label="'小数点长度:'+(index+1)"
        :key="index"
        :prop="form.fields[index].fieldDecimalLength">
        <el-row style="margin-bottom: 10px;">
          <el-col :span="12">
            <el-input v-model="field.fieldDecimalLength"  placeholder="输入小数点长度"/>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item
       v-for="(field, index) in form.fields"
       :label="'是否可以为空:'+(index+1)"
       :key="index"
       :prop="form.fields[index].fieldCanBeNull">
       <el-row style="margin-bottom: 10px;">
         <el-select v-model="field.fieldCanBeNull" placeholder="是否可以为空">
           <el-option label="是" value="1" />
           <el-option label="否" value="0" />
         </el-select>
       </el-row>
      </el-form-item>
      <el-form-item
       v-for="(field, index) in form.fields"
       :label="'是否为主键:'+(index+1)"
       :key="index"
       :prop="form.fields[index].fieldIsKey">
       <el-row style="margin-bottom: 10px;">
         <el-select v-model="field.fieldIsKey" placeholder="是否为主键">
           <el-option label="是" value="1" />
           <el-option label="否" value="0" />
         </el-select>
       </el-row>
      </el-form-item>
      <el-form-item
        v-for="(field, index) in form.fields"
        :label="'输入字段注释:'+(index+1)"
        :key="index"
        :prop="form.fields[index].fieldDescription">
        <el-row style="margin-bottom: 10px;">
          <el-input v-model="field.fieldDescription"  placeholder="输入字段注释"/>
        </el-row>
        <el-row style="margin-bottom: 10px;">
          <el-button @click.prevent="removeField(field)" type="danger">删除</el-button>
        </el-row>
      </el-form-item>
      <el-form-item label="Activity time">
        <el-col :span="11">
          <el-date-picker v-model="form.date1" type="date" placeholder="Pick a date" style="width: 100%;" />
        </el-col>
        <el-col :span="2" class="line">-</el-col>
        <el-col :span="11">
          <el-time-picker v-model="form.date2" type="fixed-time" placeholder="Pick a time" style="width: 100%;" />
        </el-col>
      </el-form-item>
      <el-form-item label="Instant delivery">
        <el-switch v-model="form.delivery" />
      </el-form-item>
      <el-form-item label="Activity type">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="Online activities" name="type" />
          <el-checkbox label="Promotion activities" name="type" />
          <el-checkbox label="Offline activities" name="type" />
          <el-checkbox label="Simple brand exposure" name="type" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="Resources">
        <el-radio-group v-model="form.resource">
          <el-radio label="Sponsor" />
          <el-radio label="Venue" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Activity form">
        <el-input v-model="form.desc" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        fields: [{
          fieldName: '',
          fieldType: '',
          fieldLength: '',
          fieldDecimalLength: '',
          fieldCanBeNull: '',
          fieldIsKey: '',
          fieldDescription: ''
        }]
      }
    }
  },
  methods: {
    addField() {
      this.form.fields.push({
        fieldName: '',
        fieldType: '',
        fieldLength: '',
        fieldDecimalLength: '',
        fieldCanBeNull: '',
        fieldIsKey: '',
        fieldDescription: ''
      })
    },
    removeField(item) {
      const index = this.form.fields.indexOf(item)
      if (index !== -1) {
        this.form.fields.splice(index, 1)
      }
    },
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
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

