<template>
  <LEchart class="echart" ref="chart" @finished="init"></LEchart>
</template>

<script setup lang="ts">
import LEchart from "@/pagesDailyReport/daily-report/components/l-echart/l-echart.vue";
// lime-echart是一个demo的组件，用于测试组件
// import LEchart from '@/components/lime-echart/lime-echart.vue'
import { onMounted, reactive, ref } from "vue";

import * as echarts from "echarts";

let chart = ref(); // 获取dom
const state = reactive({
  option: {}
});
state.option = {
  legend: {
    show: true,
    data: []
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross"
    }
  },
  grid: {
    left: "3%",
    right: "8%",
    top: "15%",
    bottom: "5%",
    containLabel: true
  },
  xAxis: {
    type: "category",
    data: ["第11周", "第12周", "第13周", "第14周"],
    axisLabel: {
      // inside: true,
      // color: '#fff'
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: "#42b983"
      }
    },
    z: 10
  },
  yAxis: {
    type: "value",
    axisLine: {
      show: true,
      lineStyle: {
        color: "#42b983"
      }
    },
    axisTick: {
      show: false
    },
    // axisLabel: {
    //   color: '#999'
    // },
    splitLine: {
      show: true,
      lineStyle: {
        type: "dashed",
        color: "#83bff6"
      }
    }
  },
  series: [
    {
      data: [724, 719, 934, 1246],
      type: "bar",
      label: {
        show: true,
        position: "top"
      },
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#83bff6" },
          { offset: 0.5, color: "#188df0" },
          { offset: 1, color: "#188df0" }
        ])
      },
      emphasis: {
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#2378f7" },
            { offset: 0.7, color: "#2378f7" },
            { offset: 1, color: "#83bff6" }
          ])
        }
      },
      areaStyle: {
        show: true,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "#188df0"
          },
          {
            offset: 1,
            color: "#fff"
          }
        ])
      }
    }
  ],
  color: ["#83bff6"]
};
// 组件能被调用必须是组件的节点已经被渲染到页面上
onMounted(() => {
  chart.value.init(echarts, (chart: { setOption: (arg0: {}) => void }) => {
    chart.setOption(state.option);
  });
});

// 渲染完成
const init = () => {
  //console.log("渲染完成");
};
</script>
<style scoped>
.echart {
  width: 100%;
  height: 300px;
}
</style>
