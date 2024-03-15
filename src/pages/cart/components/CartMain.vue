<script setup lang="ts">
import type { InputNumberBoxEvent } from "@/components/vk-data-input-number-box/vk-data-input-number-box";
import { useGuessList } from "@/composables";
import { deleteMemberCartAPI, getMemberCartAPI, putMemberCartBySkuIdAPI, putMemberCartSelectedAPI } from "@/services/cart";
import { useMemberStore } from "@/stores";
import type { CartItem } from "@/types/cart";
import { onShow } from "@dcloudio/uni-app";
import { computed, ref } from "vue";

// 是否适配底部安全区域
defineProps<{
  safeAreaInsetBottom?: boolean;
}>();

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync();

// 获取会员Store
const memberStore = useMemberStore();

// 获取购物车数据
const cartList = ref<CartItem[]>([]);
// 优化购物车空列表状态，默认展示列表
const showCartList = ref(true);
const getMemberCartData = async () => {
  const res = await getMemberCartAPI();
  cartList.value = res.result;
  showCartList.value = res.result.length > 0;
};

// 初始化调用: 页面显示触发
onShow(() => {
  if (memberStore.profile) {
    getMemberCartData();
  }
});

// 点击删除按钮
const onDeleteCart = (skuId: string) => {
  // 弹窗二次确认
  uni.showModal({
    content: "是否删除",
    confirmColor: "#27BA9B",
    success: async res => {
      if (res.confirm) {
        // 后端删除单品
        await deleteMemberCartAPI({ ids: [skuId] });
        // 重新获取列表
        getMemberCartData();
      }
    }
  });
};

// 修改商品数量
const onChangeCount = (ev: InputNumberBoxEvent) => {
  putMemberCartBySkuIdAPI(ev.index, { count: ev.value });
};

// 修改选中状态-单品修改
const onChangeSelected = (item: CartItem) => {
  // 前端数据更新-是否选中取反
  item.selected = !item.selected;
  // 后端数据更新
  putMemberCartBySkuIdAPI(item.skuId, { selected: item.selected });
};

// 计算全选状态
const isSelectedAll = computed(() => {
  return cartList.value.length && cartList.value.every(v => v.selected);
});

// 修改选中状态-全选修改
const onChangeSelectedAll = () => {
  // 全选状态取反
  const _isSelectedAll = !isSelectedAll.value;
  // 前端数据更新
  cartList.value.forEach(item => {
    item.selected = _isSelectedAll;
  });
  // 后端数据更新
  putMemberCartSelectedAPI({ selected: _isSelectedAll });
};

// 计算选中单品列表
const selectedCartList = computed(() => {
  return cartList.value.filter(v => v.selected);
});

// 计算选中总件数
const selectedCartListCount = computed(() => {
  return selectedCartList.value.reduce((sum, item) => sum + item.count, 0);
});

// 计算选中总金额
const selectedCartListMoney = computed(() => {
  return selectedCartList.value.reduce((sum, item) => sum + item.count * item.nowPrice, 0).toFixed(2);
});

// 结算按钮
const gotoPayment = () => {
  if (selectedCartListCount.value === 0) {
    return uni.showToast({
      icon: "none",
      title: "请选择商品"
    });
  }
  // 跳转到结算页
  uni.navigateTo({ url: "/pagesOrder/create/create" });
};

// 猜你喜欢
const { guessRef, onScrolltolower } = useGuessList();
</script>

<template>
  <scroll-view enable-back-to-top scroll-y class="scroll-view" @scrolltolower="onScrolltolower">
    <!-- 已登录: 显示购物车 -->
    <template v-if="memberStore.profile">
      <!-- 购物车列表 -->
      <view class="cart-list" v-if="showCartList">
        <!-- 优惠提示 -->
        <view class="tips">
          <text class="label">满减</text>
          <text class="desc">满1件, 即可享受9折优惠</text>
        </view>
        <!-- 滑动操作分区 -->
        <uni-swipe-action>
          <!-- 滑动操作项 -->
          <uni-swipe-action-item v-for="item in cartList" :key="item.skuId" class="cart-swipe">
            <!-- 商品信息 -->
            <view class="goods">
              <!-- 选中状态 -->
              <text @tap="onChangeSelected(item)" class="checkbox" :class="{ checked: item.selected }"></text>
              <navigator :url="`/pages/goods/goods?id=${item.id}`" hover-class="none" class="navigator">
                <image mode="aspectFill" class="picture" :src="item.picture"></image>
                <view class="meta">
                  <view class="name ellipsis">{{ item.name }}</view>
                  <view class="attrsText ellipsis">{{ item.attrsText }}</view>
                  <view class="price">{{ item.nowPrice }}</view>
                </view>
              </navigator>
              <!-- 商品数量 -->
              <view class="count">
                <vk-data-input-number-box
                  v-model="item.count"
                  :min="1"
                  :max="item.stock"
                  :index="item.skuId"
                  @change="onChangeCount"
                />
              </view>
            </view>
            <!-- 右侧删除按钮 -->
            <template #right>
              <view class="cart-swipe-right">
                <button @tap="onDeleteCart(item.skuId)" class="button delete-button">删除</button>
              </view>
            </template>
          </uni-swipe-action-item>
        </uni-swipe-action>
      </view>
      <!-- 购物车空状态 -->
      <view class="cart-blank" v-else>
        <image src="/static/images/blank_cart.png" class="image" />
        <text class="text">购物车还是空的，快来挑选好货吧</text>
        <navigator url="/pages/index/index" hover-class="none">
          <button class="button">去首页看看</button>
        </navigator>
      </view>
      <!-- 吸底工具栏 -->
      <view
        v-if="showCartList"
        class="toolbar"
        :style="{ paddingBottom: safeAreaInsetBottom ? safeAreaInsets?.bottom + 'px' : 0 }"
      >
        <text @tap="onChangeSelectedAll" class="all" :class="{ checked: isSelectedAll }">全选</text>
        <text class="text">合计:</text>
        <text class="amount">{{ selectedCartListMoney }}</text>
        <view class="button-grounp">
          <view @tap="gotoPayment" class="button payment-button" :class="{ disabled: selectedCartListCount === 0 }">
            去结算({{ selectedCartListCount }})
          </view>
        </view>
      </view>
    </template>
    <!-- 未登录: 提示登录 -->
    <view class="login-blank" v-else>
      <text class="text">登录后可查看购物车中的商品</text>
      <navigator url="/pages/login/login" hover-class="none">
        <button class="button">去登录</button>
      </navigator>
    </view>
    <!-- 猜你喜欢 -->
    <XtxGuess ref="guessRef" />
    <!-- 底部占位空盒子 -->
    <view class="toolbar-height"></view>
  </scroll-view>
</template>

<style lang="scss">
// 根元素
:host {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background-color: #f7f7f8;
}

// 滚动容器
.scroll-view {
  flex: 1;
  background-color: #f7f7f8;
}

// 购物车列表
.cart-list {
  padding: 0 20rpx;

  // 优惠提示
  .tips {
    display: flex;
    align-items: center;
    margin: 30rpx 10rpx;
    font-size: 26rpx;
    line-height: 1;
    color: #666666;
    .label {
      padding: 7rpx 15rpx 5rpx;
      margin-right: 10rpx;
      font-size: 24rpx;
      color: #ffffff;
      background-color: #27ba9b;
      border-radius: 4rpx;
    }
  }

  // 购物车商品
  .goods {
    position: relative;
    display: flex;
    padding: 20rpx 20rpx 20rpx 80rpx;
    background-color: #ffffff;
    border-radius: 10rpx;
    .navigator {
      display: flex;
    }
    .checkbox {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80rpx;
      height: 100%;
      &::before {
        font-family: erabbit !important;
        font-size: 40rpx;
        color: #444444;
        content: "\e6cd";
      }
      &.checked::before {
        color: #27ba9b;
        content: "\e6cc";
      }
    }
    .picture {
      width: 170rpx;
      height: 170rpx;
    }
    .meta {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 20rpx;
    }
    .name {
      height: 72rpx;
      font-size: 26rpx;
      color: #444444;
    }
    .attrsText {
      align-self: flex-start;
      padding: 0 15rpx;
      font-size: 24rpx;
      line-height: 1.8;
      color: #888888;
      background-color: #f7f7f8;
      border-radius: 4rpx;
    }
    .price {
      margin-bottom: 2rpx;
      font-size: 26rpx;
      line-height: 1;
      color: #cf4444;
      &::before {
        font-size: 80%;
        content: "￥";
      }
    }

    // 商品数量
    .count {
      position: absolute;
      right: 5rpx;
      bottom: 20rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 220rpx;
      height: 48rpx;
      .text {
        height: 100%;
        padding: 0 20rpx;
        font-size: 32rpx;
        color: #444444;
      }
      .input {
        height: 100%;
        font-size: 24rpx;
        color: #444444;
        text-align: center;
        background-color: #f6f6f6;
        border-radius: 4rpx;
      }
    }
  }
  .cart-swipe {
    display: block;
    margin: 20rpx 0;
  }
  .cart-swipe-right {
    display: flex;
    height: 100%;
    .button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      padding: 6px;
      font-size: 26rpx;
      line-height: 1.5;
      color: #ffffff;
      border-radius: 0;
    }
    .delete-button {
      background-color: #cf4444;
    }
  }
}

// 空状态
.cart-blank,
.login-blank {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  .image {
    width: 400rpx;
    height: 281rpx;
  }
  .text {
    margin: 20rpx 0;
    font-size: 26rpx;
    color: #444444;
  }
  .button {
    width: 240rpx !important;
    height: 60rpx;
    margin-top: 20rpx;
    font-size: 26rpx;
    line-height: 60rpx;
    color: #ffffff;
    background-color: #27ba9b;
    border-radius: 60rpx;
  }
}

// 吸底工具栏
.toolbar {
  position: fixed;
  right: 0;
  bottom: calc(var(--window-bottom));
  left: 0;
  z-index: 1;
  box-sizing: content-box;
  display: flex;
  align-items: center;
  height: 100rpx;
  padding: 0 20rpx;
  background-color: #ffffff;
  border-top: 1rpx solid #ededed;
  border-bottom: 1rpx solid #ededed;
  .all {
    display: flex;
    align-items: center;
    margin-left: 25rpx;
    font-size: 14px;
    color: #444444;
  }
  .all::before {
    margin-right: 8rpx;
    font-family: erabbit !important;
    font-size: 40rpx;
    content: "\e6cd";
  }
  .checked::before {
    color: #27ba9b;
    content: "\e6cc";
  }
  .text {
    margin-right: 8rpx;
    margin-left: 32rpx;
    font-size: 14px;
    color: #444444;
  }
  .amount {
    font-size: 20px;
    color: #cf4444;
    .decimal {
      font-size: 12px;
    }
    &::before {
      font-size: 12px;
      content: "￥";
    }
  }
  .button-grounp {
    display: flex;
    justify-content: space-between;
    margin-left: auto;
    font-size: 13px;
    line-height: 72rpx;
    color: #ffffff;
    text-align: center;
    .button {
      width: 240rpx;
      margin: 0 10rpx;
      border-radius: 72rpx;
    }
    .payment-button {
      background-color: #27ba9b;
      &.disabled {
        opacity: 0.6;
      }
    }
  }
}

// 底部占位空盒子
.toolbar-height {
  height: 100rpx;
}
</style>
