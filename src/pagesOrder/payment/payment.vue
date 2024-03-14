<script setup lang="ts">
import { useGuessList } from '@/composables'

// 获取页面参数
const query = defineProps<{
  id: string
}>()

// 猜你喜欢
const { guessRef, onScrolltolower } = useGuessList()
</script>

<template>
  <scroll-view enable-back-to-top class="viewport" scroll-y @scrolltolower="onScrolltolower">
    <!-- 订单状态 -->
    <view class="overview">
      <view class="status icon-checked">支付成功</view>
      <view class="buttons">
        <navigator
          hover-class="none"
          class="button navigator"
          url="/pages/index/index"
          open-type="switchTab"
        >
          返回首页
        </navigator>
        <navigator
          hover-class="none"
          class="button navigator"
          :url="`/pagesOrder/detail/detail?id=${query.id}`"
          open-type="redirect"
        >
          查看订单
        </navigator>
      </view>
    </view>

    <!-- 猜你喜欢 -->
    <XtxGuess ref="guessRef" />
  </scroll-view>
</template>

<style lang="scss">
page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.viewport {
  background-color: #f7f7f8;
}
.overview {
  padding: 50rpx 0;
  line-height: 1;
  color: #ffffff;
  background-color: #27ba9b;
  .status {
    font-size: 36rpx;
    font-weight: 500;
    text-align: center;
  }
  .status::before {
    display: block;
    margin-bottom: 20rpx;
    font-size: 110rpx;
  }
  .buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60rpx;
    margin-top: 60rpx;
    line-height: 60rpx;
  }
  .button {
    margin: 0 10rpx;
    font-size: 28rpx;
    color: #ffffff;
    text-align: center;
    &:first-child {
      width: 200rpx;
      border: 1rpx solid #ffffff;
      border-radius: 64rpx;
    }
  }
}
</style>
