<script setup lang="ts">
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync();
const imageBaseUrl = import.meta.env.VITE_IMG_BASE_URL;

// console.log("safeAreaInsets!.top:" + safeAreaInsets!.top);
</script>

<template>
  <view
    class="navbar"
    :style="{ paddingTop: safeAreaInsets!.top + 10 + 'px', backgroundImage: 'url(' + imageBaseUrl + '/swiky_bg.png)' }"
  >
    <!-- logo文字 -->
    <view class="logo">
      <image class="logo-image" :src="`${imageBaseUrl}/swiky_logo_head.png`"></image>
      <text class="logo-text">全球品牌珠宝一站式服务商</text>
    </view>
    <!-- 搜索条 -->
    <view class="search">
      <text class="icon-search">搜索商品</text>
      <text class="icon-scan"></text>
    </view>
  </view>
</template>

<style lang="scss">
/* 自定义导航条 */
.navbar {
  position: relative;
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  background-size: cover;
  .logo {
    display: flex;
    align-items: center;
    height: 64rpx;
    padding-left: 30rpx;
    .logo-image {
      width: 100px;
      height: 100%;
    }
    .logo-text {
      flex: 1;
      padding-left: 20rpx;
      margin: 2rpx 0 0 20rpx;
      font-size: 26rpx;
      line-height: 28rpx;
      color: #ffffff;
      border-left: 1rpx solid #ffffff;
    }
  }
  .search {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64rpx;
    padding: 0 10rpx 0 26rpx;
    margin: 16rpx 20rpx;
    font-size: 28rpx;
    color: #ffffff;
    background-color: rgb(255 255 255 / 50%);
    border-radius: 32rpx;
  }
  .icon-search {
    &::before {
      margin-right: 10rpx;
    }
  }
  .icon-scan {
    padding: 15rpx;
    font-size: 30rpx;
  }
}
</style>
