<script setup lang="ts">
//
</script>

<template>
  <view class="address-panel">
    <!-- 关闭按钮 -->
    <text class="close icon-close"></text>
    <!-- 标题 -->
    <view class="title">配送至</view>
    <!-- 内容 -->
    <view class="content">
      <view class="item">
        <view class="user">李明 13824686868</view>
        <view class="address">北京市顺义区后沙峪地区安平北街6号院</view>
        <text class="icon icon-checked"></text>
      </view>
      <view class="item">
        <view class="user">王东 13824686868</view>
        <view class="address">北京市顺义区后沙峪地区安平北街6号院</view>
        <text class="icon icon-ring"></text>
      </view>
      <view class="item">
        <view class="user">张三 13824686868</view>
        <view class="address">北京市朝阳区孙河安平北街6号院</view>
        <text class="icon icon-ring"></text>
      </view>
    </view>
    <view class="footer">
      <view class="button primary"> 新建地址 </view>
      <view v-if="false" class="button primary">确定</view>
    </view>
  </view>
</template>

<style lang="scss">
.address-panel {
  position: relative;
  padding: 0 30rpx;
  background-color: #ffffff;
  border-radius: 10rpx 10rpx 0 0;
}
.title {
  padding: 40rpx 0;
  font-size: 32rpx;
  font-weight: normal;
  line-height: 1;
  color: #444444;
  text-align: center;
  border-bottom: 1rpx solid #dddddd;
}
.close {
  position: absolute;
  top: 24rpx;
  right: 24rpx;
}
.content {
  min-height: 300rpx;
  max-height: 540rpx;
  padding: 20rpx;
  overflow: auto;
  .item {
    position: relative;
    padding: 30rpx 50rpx 30rpx 60rpx;
    background-image: url('https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/locate.png');
    background-repeat: no-repeat;
    background-position: 0 center;
    background-size: 40rpx;
  }
  .icon {
    position: absolute;
    top: 50%;
    right: 0;
    font-size: 40rpx;
    color: #999999;
    transform: translateY(-50%);
  }
  .icon-checked {
    color: #27ba9b;
  }
  .icon-ring {
    color: #444444;
  }
  .user {
    font-size: 28rpx;
    font-weight: 500;
    color: #444444;
  }
  .address {
    font-size: 26rpx;
    color: #666666;
  }
}
.footer {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 0 40rpx;
  font-size: 28rpx;
  color: #444444;
  .button {
    flex: 1;
    height: 72rpx;
    margin: 0 20rpx;
    line-height: 72rpx;
    color: #ffffff;
    text-align: center;
    border-radius: 72rpx;
  }
  .primary {
    color: #ffffff;
    background-color: #27ba9b;
  }
  .secondary {
    background-color: #ffa868;
  }
}
</style>
