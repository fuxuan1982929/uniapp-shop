<script setup lang="ts">
import type { CategoryItem } from "@/types/home";

// 定义 props 接收数据
const props = defineProps<{
  list: CategoryItem[];
}>();

//console.log(props.list);
</script>

<template>
  <view class="category">
    <navigator class="category-item" hover-class="none" :url="item.hrefUrl" v-for="item in list" :key="item.id">
      <image class="icon" :src="item.icon"></image>
      <text class="text">{{ item.name }}</text>
    </navigator>
  </view>
</template>

<style lang="scss">
@import "../styles/category.scss";
</style>
