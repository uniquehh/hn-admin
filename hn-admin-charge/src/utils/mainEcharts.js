// 饼状图
export function setPieOptions(echarts,dataArray){
  console.log(echarts)
  echarts.setOption({
    tooltip: {
      trigger: 'item',
      formatter:'{b}:{c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      bottom: 'bottom'
    },
    series: [
      {
        type: 'pie',
        radius: '80%',
        data: dataArray,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  })
}

//堆叠图
export function barOptions(echarts,titleData,dataJson){
   echarts.setOption({
     tooltip: {
       trigger: 'axis',
       axisPointer: {
         // Use axis to trigger tooltip
         type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
       }
     },
     legend: {
       bottom: 'bottom'
     },
     grid: {
       top:'1%',
       left: '1%',
       right: '2%',
       bottom: '8%',
       containLabel: true
     },
     xAxis: {
       type: 'value'
     },
     yAxis: {
       type: 'category',
       data: titleData
     },
     series: [
       {
         name: '练车预约',
         type: 'bar',
         stack: 'total',
         label: {
           show: true
         },
         emphasis: {
           focus: 'series'
         },
         data: dataJson['lc']
       },
       {
         name: '考场练习',
         type: 'bar',
         stack: 'total',
         label: {
           show: true
         },
         emphasis: {
           focus: 'series'
         },
         data: dataJson['kc']
       },
       {
         name: '班车预约',
         type: 'bar',
         stack: 'total',
         label: {
           show: true
         },
         emphasis: {
           focus: 'series'
         },
         data: dataJson['bc']
       },
       {
         name: '餐厅预约',
         type: 'bar',
         stack: 'total',
         label: {
           show: true
         },
         emphasis: {
           focus: 'series'
         },
         data: dataJson['ct']
       }
     ]
   })
}


/*
学员学车折线
 */

export function learnCarOption(echarts,title,dataJson){
  echarts.setOption({
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      bottom:'bottom',
      data: ['参考人数', '通过人数', '待考人数', '学车人数']
    },
    grid: {
      top:'3%',
      left: '1%',
      right: '5%',
      bottom: '8%',
      containLabel: true
    },

    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: title
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '参考人数',
        type: 'line',
        stack: 'Total',
        smooth: false,
        data: dataJson['ck']
      },
      {
        name: '通过人数',
        type: 'line',
        stack: 'Total',
        smooth: false,
        data: dataJson['kg']
      },
      {
        name: '待考人数',
        type: 'line',
        stack: 'Total',
        smooth: false,
        data: dataJson['dk']
      },
      {
        name: '学车人数',
        type: 'line',
        stack: 'Total',
        smooth: false,
        data: dataJson['xc']
      }
    ]
  })
}


// 报名方式

export function signLineOption(echarts,title,dataJson){
  echarts.setOption({
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      bottom:'bottom',
      data: ['线下报名', 'web报名', '小程序报名', 'App报名']
    },
    grid: {
      top:'3%',
      left: '1%',
      right: '5%',
      bottom: '8%',
      containLabel: true
    },

    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: title
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '线下报名',
        type: 'line',
        smooth: true,
        data: dataJson['offline']
      },
      {
        name: 'web报名',
        type: 'line',
        smooth: true,
        data: dataJson['web']
      },
      {
        name: '小程序报名',
        type: 'line',
        smooth: true,
        data: dataJson['wx']
      },
      {
        name: 'App报名',
        type: 'line',
        smooth: true,
        data: dataJson['app']
      }
    ]
  })
}

export function SignPieOptions(echarts,dataArray){
  echarts.setOption({
    label:{
      formatter:'{b}:{c}\n({d}%)'
    },
    series: [
      {
        type: 'pie',
        radius: '55%',
        data: dataArray,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  })
}


// 注册的折线图

export function loginOption(echarts,title,dataJson){
  echarts.setOption({
    xAxis: {
      type: 'category',
      data: title
    },
    yAxis: {
      type: 'value'
    },
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      top:'3%',
      left: '1%',
      right: '5%',
      bottom: '8%',
      containLabel: true
    },
    legend: {
      bottom:'bottom',
      data:['web注册','小程序注册','App注册']
    },
    series: [
      {
        name:'web注册',
        data: dataJson['web'],
        type: 'bar'
      },
      {
        name:'小程序注册',
        data: dataJson['wx'],
        type: 'bar'
      },
      {
        name:'App注册',
        data: dataJson['app'],
        type: 'bar'
      }
    ]
  })
}
