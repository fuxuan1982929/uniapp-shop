<script setup lang="ts">
import { deleteMemberAddressByIdAPI, getMemberAddressAPI } from "@/services/address";
import { useAddressStore } from "@/stores/modules/address";
import type { AddressItem } from "@/types/address";
import { onShow } from "@dcloudio/uni-app";
import { ref } from "vue";

// 获取收货地址列表数据
const addressList = ref<AddressItem[]>([]);
const getMemberAddressData = async () => {
  const res = await getMemberAddressAPI();
  addressList.value = res.result;
};

// 初始化调用(页面显示)
onShow(() => {
  getMemberAddressData();
});

// 删除收货地址
const onDeleteAddress = (id: string) => {
  // 二次确认
  uni.showModal({
    content: "删除地址?",
    confirmColor: "#27BA9B",
    success: async res => {
      if (res.confirm) {
        // 根据id删除收货地址
        await deleteMemberAddressByIdAPI(id);
        // 重新获取收货地址列表
        getMemberAddressData();
      }
    }
  });
};

// 修改收货地址
const onChangeAddress = (item: AddressItem) => {
  // 修改地址
  const addressStore = useAddressStore();
  addressStore.changeSelectedAddress(item);
  // 返回上一页
  uni.navigateBack();
};
</script>

<template>
  <view class="viewport">
    <!-- 地址列表 -->
    <scroll-view enable-back-to-top class="scroll-view" scroll-y>
      <view v-if="addressList.length" class="address">
        <uni-swipe-action class="address-list">
          <!-- 收货地址项 -->
          <uni-swipe-action-item class="item" v-for="item in addressList" :key="item.id">
            <view class="item-content" @tap="onChangeAddress(item)">
              <view class="user">
                {{ item.receiver }}
                <text class="contact">{{ item.contact }}</text>
                <text v-if="item.isDefault" class="badge">默认</text>
              </view>
              <view class="locate">{{ item.fullLocation }} {{ item.address }}</view>
              <!-- H5 端需添加 .prevent 阻止链接的默认行为 -->
              <navigator
                class="edit"
                hover-class="none"
                :url="`/pagesMember/address-form/address-form?id=${item.id}`"
                @tap.stop="() => {}"
                @tap.prevent="() => {}"
              >
                修改
              </navigator>
            </view>
            <!-- 右侧插槽 -->
            <template #right>
              <button @tap="onDeleteAddress(item.id)" class="delete-button">删除</button>
            </template>
          </uni-swipe-action-item>
        </uni-swipe-action>
      </view>
      <view v-else class="blank">暂无收货地址</view>
    </scroll-view>
    <!-- 添加按钮 -->
    <view class="add-btn">
      <navigator hover-class="none" url="/pagesMember/address-form/address-form"> 新建地址 </navigator>
    </view>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}

/* 删除按钮 */
.delete-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 100%;
  padding: 0;
  font-size: 28rpx;
  color: #ffffff;
  background-color: #cf4444;
  border-radius: 0;
}
.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f4f4f4;
  .scroll-view {
    padding-top: 20rpx;
  }
}
.address {
  padding: 0 20rpx;
  margin: 0 20rpx;
  background-color: #ffffff;
  border-radius: 10rpx;
  .item-content {
    position: relative;
    padding: 40rpx 10rpx 38rpx;
    line-height: 1;
    border-bottom: 1rpx solid #dddddd;
    .edit {
      position: absolute;
      top: 36rpx;
      right: 30rpx;
      padding: 2rpx 0 2rpx 20rpx;
      font-size: 26rpx;
      line-height: 1;
      color: #666666;
      border-left: 1rpx solid #666666;
    }
  }
  .item:last-child .item-content {
    border: none;
  }
  .user {
    margin-bottom: 20rpx;
    font-size: 28rpx;
    color: #333333;
    .contact {
      color: #666666;
    }
    .badge {
      display: inline-block;
      padding: 4rpx 10rpx 2rpx 14rpx;
      margin: 2rpx 0 0 10rpx;
      font-size: 26rpx;
      color: #27ba9b;
      border: 1rpx solid #27ba9b;
      border-radius: 6rpx;
    }
  }
  .locate {
    font-size: 26rpx;
    line-height: 1.6;
    color: #333333;
  }
}
.blank {
  margin-top: 300rpx;
  font-size: 32rpx;
  color: #888888;
  text-align: center;
}
.add-btn {
  height: 80rpx;
  margin: 30rpx 20rpx;
  font-size: 30rpx;
  line-height: 80rpx;
  color: #ffffff;
  text-align: center;
  background-color: #27ba9b;
  border-radius: 80rpx;
}
</style>
