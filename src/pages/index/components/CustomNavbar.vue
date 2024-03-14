<script setup lang="ts">
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
</script>

<template>
  <view class="navbar" :style="{ paddingTop: safeAreaInsets!.top + 10 + 'px' }">
    <!-- logo文字 -->
    <view class="logo">
      <image class="logo-image" src="@/static/images/swiky_logo.png"></image>
      <text class="logo-text">内部服务</text>
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
  background-image: url('@/static/images/swiky_bg.png');
  background-size: cover;
  .logo {
    display: flex;
    align-items: center;
    height: 64rpx;
    padding-left: 30rpx;
    .logo-image {
      width: 166rpx;
      height: 39rpx;
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
