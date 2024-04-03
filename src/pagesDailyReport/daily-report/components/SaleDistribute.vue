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
  // tooltip: {
  //   trigger: "axis",
  //   axisPointer: {
  //     type: "cross"
  //   }
  // },
  grid: {
    left: "3%",
    right: "8%",
    top: "15%",
    bottom: "5%",
    containLabel: true
  },
  xAxis: {
    type: "category",
    data: ["03/29", "03/30", "03/31", "04/01", "04/02", "04/03"],
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
    }
  },
  series: [
    {
      data: [10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000],
      type: "line"
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
  console.log("渲染完成");
};
</script>
<style scoped>
.echart {
  width: 100%;
  height: 300px;
}
</style>
