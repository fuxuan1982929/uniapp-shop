<script setup lang="ts">
import { getHomeBannerAPI, getHomeCategoryAPI, getHomeHotAPI } from "@/services/home";
import type { BannerItem, CategoryItem, HotItem } from "@/types/home";
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";
import CustomNavbar from "./components/CustomNavbar.vue";
import CategoryPanel from "./components/CategoryPanel.vue";
//import HotPanel from "./components/HotPanel.vue";
import PageSkeleton from "./components/PageSkeleton.vue";
import { useGuessList } from "@/composables";

// 获取轮播图数据
const bannerList = ref<BannerItem[]>([]);
const getHomeBannerData = async () => {
  const res = await getHomeBannerAPI();
  //bannerList.value = res.result; //for api
  bannerList.value = res;
};

// 获取主菜单数据
//const categoryList = ref<CategoryItem[]>([]);
// const getHomeCategoryData = async () => {
//   const res = await getHomeCategoryAPI();
//   //categoryList.value = res.result; //for api
//   categoryList.value = res;
// };

// 获取热门推荐数据
const hotList = ref<HotItem[]>([]);
const getHomeHotData = async () => {
  const res = await getHomeHotAPI();
  hotList.value = res.data;
};

// 是否加载中标记
const isLoading = ref(false);

// 页面加载
onLoad(async () => {
  isLoading.value = true;
  //await Promise.all([getHomeBannerData(), getHomeCategoryData(), getHomeHotData()]);
  await Promise.all([getHomeBannerData()]);
  isLoading.value = false;
});

// 猜你喜欢组合式函数调用
const { guessRef, onScrolltolower } = useGuessList();
// 当前下拉刷新状态
const isTriggered = ref(false);
// 自定义下拉刷新被触发
const onRefresherrefresh = async () => {
  // 开始动画
  isTriggered.value = true;
  // 加载数据
  // await getHomeBannerData()
  // await getHomeCategoryData()
  // await getHomeHotData()
  // 重置猜你喜欢组件数据
  guessRef.value?.resetData();
  await Promise.all([getHomeBannerData(), guessRef.value?.getMore()]);
  // 关闭动画
  isTriggered.value = false;
};
</script>

<template>
  <view class="viewport">
    <!-- 自定义导航栏 -->
    <CustomNavbar />
    <!-- 滚动容器 -->
    <scroll-view
      enable-back-to-top
      refresher-enabled
      @refresherrefresh="onRefresherrefresh"
      :refresher-triggered="isTriggered"
      @scrolltolower="onScrolltolower"
      class="scroll-view"
      scroll-y
    >
      <PageSkeleton v-if="isLoading" />
      <template v-else>
        <!-- 自定义轮播图 -->
        <XtxSwiper :list="bannerList" />
        <!-- 分类面板 -->
        <CategoryPanel />
        <!-- 热门推荐 -->
        <!-- <HotPanel :list="hotList" /> -->
        <!-- 猜你喜欢 -->
        <!-- <XtxGuess ref="guessRef" /> -->
      </template>
    </scroll-view>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  background-color: #f7f7f7;
}
.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.scroll-view {
  flex: 1;
  overflow: hidden;
}
</style>
