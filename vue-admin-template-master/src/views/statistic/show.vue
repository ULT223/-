<template>
    <div class="app-container">
      <!--表单-->
      <el-form :inline="true" class="demo-form-inline">
  
        <el-form-item>
          <el-select v-model="searchObj.type" clearable placeholder="请选择">
            <el-option label="学员登录数统计" value="login_num"/>
            <el-option label="学员注册数统计" value="register_num"/>
            <el-option label="课程播放数统计" value="video_view_num"/>
            <el-option label="每日课程数统计" value="course_num"/>
          </el-select>
        </el-form-item>
  
        <el-form-item>
          <el-date-picker
            v-model="searchObj.begin"
            type="date"
            placeholder="选择开始日期"
            value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="searchObj.end"
            type="date"
            placeholder="选择截止日期"
            value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-button
          :disabled="btnDisabled"
          type="primary"
          icon="el-icon-search"
          @click="showChart()">查询</el-button>
      </el-form>
  
      <div class="chart-container">
        <div id="chart" class="chart" style="height:500px;width:100%" />
      </div>
    </div>
  </template>
  <script>
  import * as echarts from 'echarts'
  import staApi from '@/api/statistic'
  
  export default {
   data() {
    return {
        searchObj: {
        type: '',
        begin: '',
        end: ''
      },
      btnDisabled: false,
      chart: null,
      title: '',
      xData: [],
      yData: []
    }
   }, 
   created() {
    
   },
   methods: {
    showChart(){
        staApi.getDataSta(this.searchObj)
        .then(response => {
            this.xData = response.data.date_calculatedList
            this.yData = response.data.numDataList
            console.log("xData:"+this.xData)

            //调用下面生成图表的方法
            this.setChart()
        })
    },
    setChart() {
        this.chart = echarts.init(document.getElementById('chart'))
        var option = {
        title:{
            text:'数据统计',
        },
        tooltip:{
            trigger:'axis'
        },
        xAxis: {
            // x轴是类目轴(离散数据)，必须通过data设置类目数据
            type: 'category',
            data: this.xData
        },
        yAxis: {
            //y轴是数据轴
            type: 'value'
        },
        //系列列表，每个系列通过type决定自己的图表类型
        series: [
            {
                data: this.yData,
                type: 'line'
            }
        ]
        };
        this.chart.setOption(option)
    }, 
   },
  }
  </script>