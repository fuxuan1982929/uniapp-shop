<script setup lang="ts">
import { getHomeGoodsGuessLikeAPI } from "@/services/home";
import type { PageParams } from "@/types/global";
import type { GuessItem } from "@/types/home";
import { onMounted, ref } from "vue";

// 分页参数
const pageParams: Required<PageParams> = {
  page: 1,
  pageSize: 10
};
// 猜你喜欢的列表
const guessList = ref<GuessItem[]>([]);
// 已结束标记
const finish = ref(false);
// 获取猜你喜欢数据
const getHomeGoodsGuessLikeData = async () => {
  // 退出分页判断
  if (finish.value === true) {
    return uni.showToast({ icon: "none", title: "没有更多数据~" });
  }
  const res = await getHomeGoodsGuessLikeAPI(pageParams);
  // guessList.value = res.result.items
  // 数组追加
  guessList.value.push(...res.result.items);
  // 分页条件
  if (pageParams.page < res.result.pages) {
    // 页码累加
    pageParams.page++;
  } else {
    finish.value = true;
  }
};
// 重置数据
const resetData = () => {
  pageParams.page = 1;
  guessList.value = [];
  finish.value = false;
};
// 组件挂载完毕
onMounted(() => {
  getHomeGoodsGuessLikeData();
});
// 暴露方法
defineExpose({
  resetData,
  getMore: getHomeGoodsGuessLikeData
});
</script>

<template>
  <!-- 猜你喜欢 -->
  <view class="caption">
    <text class="text">猜你喜欢</text>
  </view>
  <view class="guess">
    <navigator class="guess-item" v-for="item in guessList" :key="item.id" :url="`/pages/goods/goods?id=${item.id}`">
      <image class="image" mode="aspectFill" :src="item.picture"></image>
      <view class="name"> {{ item.name }} </view>
      <view class="price">
        <text class="small">¥</text>
        <text>{{ item.price }}</text>
      </view>
    </navigator>
  </view>
  <view class="loading-text">
    {{ finish ? "没有更多数据~" : "正在加载..." }}
  </view>
</template>

<style lang="scss">
:host {
  display: block;
}

/* 分类标题 */
.caption {
  display: flex;
  justify-content: center;
  padding: 36rpx 0 40rpx;
  font-size: 32rpx;
  line-height: 1;
  color: #262626;
  .text {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 28rpx 0 30rpx;
    &::before,
    &::after {
      width: 20rpx;
      height: 20rpx;
      margin: 0 10rpx;
      content: "";
      background-image: url("@/static/images/bubble.png");
      background-size: contain;
    }
  }
}

/* 猜你喜欢 */
.guess {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20rpx;
  .guess-item {
    width: 345rpx;
    padding: 24rpx 20rpx 20rpx;
    margin-bottom: 20rpx;
    overflow: hidden;
    background-color: #ffffff;
    border-radius: 10rpx;
  }
  .image {
    width: 304rpx;
    height: 304rpx;
  }
  .name {
    display: -webkit-box;
    height: 75rpx;
    margin: 10rpx 0;
    overflow: hidden;
    font-size: 26rpx;
    color: #262626;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .price {
    padding-top: 4rpx;
    font-size: 26rpx;
    line-height: 1;
    color: #cf4444;
  }
  .small {
    font-size: 80%;
  }
}

// 加载提示文字
.loading-text {
  padding: 20rpx 0;
  font-size: 28rpx;
  color: #666666;
  text-align: center;
}
</style>
