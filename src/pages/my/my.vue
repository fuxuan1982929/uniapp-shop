<script setup lang="ts">
import { useGuessList } from "@/composables";
import { useMemberStore } from "@/stores";
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync();
const imageBaseUrl = import.meta.env.VITE_IMG_BASE_URL;
// 订单选项
const orderTypes = [
  { type: "1", text: "待付款", icon: "icon-currency" },
  { type: "2", text: "待发货", icon: "icon-gift" },
  { type: "3", text: "待收货", icon: "icon-check" },
  { type: "4", text: "待评价", icon: "icon-comment" }
];
// 获取会员信息
const memberStore = useMemberStore();
console.log("memberStore.profile:" + memberStore.profile);
const { guessRef, onScrolltolower } = useGuessList();
</script>

<template>
  <scroll-view enable-back-to-top @scrolltolower="onScrolltolower" class="viewport" scroll-y>
    <!-- 个人资料 -->
    <view class="profile" :style="{ paddingTop: safeAreaInsets!.top + 'px' }">
      <!-- 情况1：已登录 -->
      <view class="overview" v-if="memberStore.profile">
        <navigator url="/pagesMember/profile/profile" hover-class="none">
          <image class="avatar" :src="`${imageBaseUrl}/my.png`" mode="aspectFill"></image>
        </navigator>
        <view class="meta">
          <view class="nickname">
            {{ memberStore.profile.Name || memberStore.profile.Number }}
          </view>
          <navigator class="extra" url="/pagesMember/profile/profile" hover-class="none">
            <text class="update">更新头像昵称</text>
          </navigator>
        </view>
      </view>
      <!-- 情况2：未登录 -->
      <view class="overview" v-else>
        <navigator url="/pages/login/login" hover-class="none">
          <image class="avatar gray" mode="aspectFill" :src="`${imageBaseUrl}/my.png`"></image>
        </navigator>
        <view class="meta">
          <navigator url="/pages/login/login" hover-class="none" class="nickname"> 未登录 </navigator>
          <view class="extra">
            <text class="tips">点击登录账号</text>
          </view>
        </view>
      </view>
      <navigator class="settings" url="/pagesMember/settings/settings" hover-class="none"> 设置 </navigator>
    </view>
    <!-- 我的订单 -->
    <view class="orders" v-if="false">
      <view class="title">
        我的订单
        <navigator class="navigator" url="/pagesOrder/list/list?type=0" hover-class="none">
          查看全部订单<text class="icon-right"></text>
        </navigator>
      </view>
      <view class="section">
        <!-- 订单 -->
        <navigator
          v-for="item in orderTypes"
          :key="item.type"
          :class="item.icon"
          :url="`/pagesOrder/list/list?type=${item.type}`"
          class="navigator"
          hover-class="none"
        >
          {{ item.text }}
        </navigator>
        <!-- 客服 -->
        <!-- #ifdef MP-WEIXIN -->
        <button class="contact icon-handset" open-type="contact">售后</button>
        <!-- #endif -->
      </view>
    </view>
  </scroll-view>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  background-color: #f7f7f8;
}
.viewport {
  height: 100%;
  background-image: url("https://apitest.ukynda.com/images/appresource/swiky_bg.png");
  background-repeat: no-repeat;
  //background-size: 100% auto;
}

/* 用户信息 */
.profile {
  position: relative;
  margin-top: 30rpx;
  .overview {
    display: flex;
    height: 120rpx;
    padding: 0 36rpx;
    color: #ffffff;
  }
  .avatar {
    width: 120rpx;
    height: 120rpx;
    background-color: #eeeeee;
    border-radius: 50%;
  }
  .gray {
    filter: grayscale(100%);
  }
  .meta {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 16rpx 0;
    margin-left: 20rpx;
    line-height: 30rpx;
  }
  .nickname {
    max-width: 180rpx;
    margin-bottom: 16rpx;
    overflow: hidden;
    font-size: 30rpx;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .extra {
    display: flex;
    font-size: 20rpx;
  }
  .tips {
    font-size: 22rpx;
  }
  .update {
    padding: 3rpx 10rpx 1rpx;
    margin-right: 10rpx;
    color: rgb(255 255 255 / 80%);
    border: 1rpx solid rgb(255 255 255 / 80%);
    border-radius: 30rpx;
  }
  .settings {
    position: absolute;
    right: 40rpx;
    bottom: 0;
    font-size: 30rpx;
    color: #ffffff;
  }
}

/* 我的订单 */
.orders {
  position: relative;
  z-index: 99;
  padding: 30rpx;
  margin: 50rpx 20rpx 0;
  background-color: #ffffff;
  border-radius: 10rpx;
  box-shadow: 0 4rpx 6rpx rgb(240 240 240 / 60%);
  .title {
    height: 40rpx;
    font-size: 28rpx;
    line-height: 40rpx;
    color: #1e1e1e;
    .navigator {
      float: right;
      font-size: 24rpx;
      color: #939393;
    }
  }
  .section {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 40rpx 20rpx 10rpx;
    .navigator,
    .contact {
      font-size: 24rpx;
      color: #333333;
      text-align: center;
      &::before {
        display: block;
        font-size: 60rpx;
        color: #ff9545;
      }
      &::after {
        border: none;
      }
    }
    .contact {
      padding: 0;
      margin: 0;
      line-height: inherit;
      background-color: transparent;
      border: 0;
    }
  }
}

/* 猜你喜欢 */
.guess {
  margin-top: 20rpx;
  background-color: #f7f7f8;
}
</style>
