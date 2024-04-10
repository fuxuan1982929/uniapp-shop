<script setup lang="ts">
import type { CategoryItem } from "@/types/home";

// 定义 props 接收数据
// const props = defineProps<{
//   list: CategoryItem[];
// }>();

//console.log(props.list);
</script>

<template>
  <view class="category">
    <navigator
      target="miniProgram"
      open-type="navigate"
      app-id="wxfbe30e791ec5e18e"
      version="trial"
      class="category-item"
      hover-class="none"
    >
      <image class="icon" src="https://apitest.ukynda.com/images/appresource/micro-task.png"></image>
      <text class="text">微任务</text>
    </navigator>
  </view>
</template>

<style lang="scss">
@import "../styles/category.scss";
</style>
