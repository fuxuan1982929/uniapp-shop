<script setup lang="ts">
import type {
  SkuPopupEvent,
  SkuPopupInstance,
  SkuPopupLocaldata,
} from '@/components/vk-data-goods-sku-popup/vk-data-goods-sku-popup'
import { postMemberCartAPI } from '@/services/cart'
import { getGoodsByIdAPI } from '@/services/goods'
import type { GoodsResult } from '@/types/goods'
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import AddressPanel from './components/AddressPanel.vue'
import ServicePanel from './components/ServicePanel.vue'

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

// 接收页面参数
const query = defineProps<{
  id: string
}>()

// 获取商品详情信息
const goods = ref<GoodsResult>()
const getGoodsByIdData = async () => {
  const res = await getGoodsByIdAPI(query.id)
  goods.value = res.result
  // SKU组件所需格式
  localdata.value = {
    _id: res.result.id,
    name: res.result.name,
    goods_thumb: res.result.mainPictures[0],
    spec_list: res.result.specs.map(v => {
      return {
        name: v.name,
        list: v.values,
      }
    }),
    sku_list: res.result.skus.map(v => {
      return {
        _id: v.id,
        goods_id: res.result.id,
        goods_name: res.result.name,
        image: v.picture,
        price: v.price * 100, // 注意：需要乘以 100
        stock: v.inventory,
        sku_name_arr: v.specs.map(vv => vv.valueName),
      }
    }),
  }
}

// 页面加载
onLoad(() => {
  getGoodsByIdData()
})

// 轮播图变化时
const currentIndex = ref(0)
const onChange: UniHelper.SwiperOnChange = ev => {
  currentIndex.value = ev.detail.current
}

// 点击图片时
const onTapImage = (url: string) => {
  // 大图预览
  uni.previewImage({
    current: url,
    urls: goods.value!.mainPictures,
  })
}

// uni-ui 弹出层组件 ref
const popup = ref<{
  open: (type?: UniHelper.UniPopupType) => void
  close: () => void
}>()

// 弹出层条件渲染
const popupName = ref<'address' | 'service'>()
const openPopup = (name: typeof popupName.value) => {
  // 修改弹出层名称
  popupName.value = name
  popup.value?.open()
}
// 是否显示SKU组件
const isShowSku = ref(false)
// 商品信息
const localdata = ref({} as SkuPopupLocaldata)
// 按钮模式
enum SkuMode {
  Both = 1,
  Cart = 2,
  Buy = 3,
}
const mode = ref<SkuMode>(SkuMode.Cart)
// 打开SKU弹窗修改按钮模式
const openSkuPopup = (val: SkuMode) => {
  // 显示SKU弹窗
  isShowSku.value = true
  // 修改按钮模式
  mode.value = val
}
// SKU组件实例
const skuPopupRef = ref<SkuPopupInstance>()
// 计算被选中的值
const selectArrText = computed(() => {
  return skuPopupRef.value?.selectArr?.join(' ').trim() || '请选择商品规格'
})
// 加入购物车事件
const onAddCart = async (ev: SkuPopupEvent) => {
  await postMemberCartAPI({ skuId: ev._id, count: ev.buy_num })
  uni.showToast({ title: '添加成功' })
  isShowSku.value = false
}
// 立即购买
const onBuyNow = (ev: SkuPopupEvent) => {
  uni.navigateTo({ url: `/pagesOrder/create/create?skuId=${ev._id}&count=${ev.buy_num}` })
}
</script>

<template>
  <!-- SKU弹窗组件 -->
  <vk-data-goods-sku-popup
    v-model="isShowSku"
    :localdata="localdata"
    :mode="mode"
    add-cart-background-color="#FFA868"
    buy-now-background-color="#27BA9B"
    ref="skuPopupRef"
    :actived-style="{
      color: '#27BA9B',
      borderColor: '#27BA9B',
      backgroundColor: '#E9F8F5',
    }"
    @add-cart="onAddCart"
    @buy-now="onBuyNow"
  />
  <scroll-view enable-back-to-top scroll-y class="viewport">
    <!-- 基本信息 -->
    <view class="goods">
      <!-- 商品主图 -->
      <view class="preview">
        <swiper @change="onChange" circular>
          <swiper-item v-for="item in goods?.mainPictures" :key="item">
            <image class="image" @tap="onTapImage(item)" mode="aspectFill" :src="item" />
          </swiper-item>
        </swiper>
        <view class="indicator">
          <text class="current">{{ currentIndex + 1 }}</text>
          <text class="split">/</text>
          <text class="total">{{ goods?.mainPictures.length }}</text>
        </view>
      </view>

      <!-- 商品简介 -->
      <view class="meta">
        <view class="price">
          <text class="symbol">¥</text>
          <text class="number">{{ goods?.price }}</text>
        </view>
        <view class="name ellipsis">{{ goods?.name }}</view>
        <view class="desc"> {{ goods?.desc }} </view>
      </view>

      <!-- 操作面板 -->
      <view class="action">
        <view @tap="openSkuPopup(SkuMode.Both)" class="item arrow">
          <text class="label">选择</text>
          <text class="text ellipsis"> {{ selectArrText }} </text>
        </view>
        <view @tap="openPopup('address')" class="item arrow">
          <text class="label">送至</text>
          <text class="text ellipsis"> 请选择收获地址 </text>
        </view>
        <view @tap="openPopup('service')" class="item arrow">
          <text class="label">服务</text>
          <text class="text ellipsis"> 无忧退 快速退款 免费包邮 </text>
        </view>
      </view>
    </view>

    <!-- 商品详情 -->
    <view class="detail panel">
      <view class="title">
        <text>详情</text>
      </view>
      <view class="content">
        <view class="properties">
          <!-- 属性详情 -->
          <view class="item" v-for="item in goods?.details.properties" :key="item.name">
            <text class="label">{{ item.name }}</text>
            <text class="value">{{ item.value }}</text>
          </view>
        </view>
        <!-- 图片详情 -->
        <image
          class="image"
          v-for="item in goods?.details.pictures"
          :key="item"
          mode="widthFix"
          :src="item"
        ></image>
      </view>
    </view>

    <!-- 同类推荐 -->
    <view class="similar panel">
      <view class="title">
        <text>同类推荐</text>
      </view>
      <view class="content">
        <navigator
          v-for="item in goods?.similarProducts"
          :key="item.id"
          class="goods"
          hover-class="none"
          :url="`/pages/goods/goods?id=${item.id}`"
        >
          <image class="image" mode="aspectFill" :src="item.picture"></image>
          <view class="name ellipsis">{{ item.name }}</view>
          <view class="price">
            <text class="symbol">¥</text>
            <text class="number">{{ item.price }}</text>
          </view>
        </navigator>
      </view>
    </view>
  </scroll-view>

  <!-- 用户操作 -->
  <view v-if="goods" class="toolbar" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
    <view class="icons">
      <button class="icons-button"><text class="icon-heart"></text>收藏</button>
      <!-- #ifdef MP-WEIXIN -->
      <button class="icons-button" open-type="contact">
        <text class="icon-handset"></text>客服
      </button>
      <!-- #endif -->
      <navigator class="icons-button" url="/pages/cart/cart2" open-type="navigate">
        <text class="icon-cart"></text>购物车
      </navigator>
    </view>
    <view class="buttons">
      <view @tap="openSkuPopup(SkuMode.Cart)" class="addcart"> 加入购物车 </view>
      <view @tap="openSkuPopup(SkuMode.Buy)" class="payment"> 立即购买 </view>
    </view>
  </view>

  <!-- uni-ui 弹出层 -->
  <uni-popup ref="popup" type="bottom" background-color="#fff">
    <AddressPanel v-if="popupName === 'address'" @close="popup?.close()" />
    <ServicePanel v-if="popupName === 'service'" @close="popup?.close()" />
  </uni-popup>
</template>

<style lang="scss">
page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.viewport {
  background-color: #f4f4f4;
}
.panel {
  margin-top: 20rpx;
  background-color: #ffffff;
  .title {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 90rpx;
    padding: 30rpx 60rpx 30rpx 6rpx;
    line-height: 1;
    text {
      padding-left: 10rpx;
      font-size: 28rpx;
      font-weight: 600;
      color: #333333;
      border-left: 4rpx solid #27ba9b;
    }
    navigator {
      font-size: 24rpx;
      color: #666666;
    }
  }
}
.arrow {
  &::after {
    position: absolute;
    top: 50%;
    right: 30rpx;
    font-family: erabbit !important;
    font-size: 32rpx;
    color: #cccccc;
    content: '\e6c2';
    transform: translateY(-50%);
  }
}

/* 商品信息 */
.goods {
  background-color: #ffffff;
  .preview {
    position: relative;
    height: 750rpx;
    .image {
      width: 750rpx;
      height: 750rpx;
    }
    .indicator {
      position: absolute;
      right: 30rpx;
      bottom: 30rpx;
      height: 40rpx;
      padding: 0 24rpx;
      font-family: Arial, Helvetica, sans-serif;
      line-height: 40rpx;
      color: #ffffff;
      background-color: rgb(0 0 0 / 30%);
      border-radius: 30rpx;
      .current {
        font-size: 26rpx;
      }
      .split {
        margin: 0 1rpx 0 2rpx;
        font-size: 24rpx;
      }
      .total {
        font-size: 24rpx;
      }
    }
  }
  .meta {
    position: relative;
    border-bottom: 1rpx solid #eaeaea;
    .price {
      box-sizing: border-box;
      height: 130rpx;
      padding: 25rpx 30rpx 0;
      font-size: 34rpx;
      color: #ffffff;
      background-color: #35c8a9;
    }
    .number {
      font-size: 56rpx;
    }
    .brand {
      position: absolute;
      top: 26rpx;
      right: 30rpx;
      width: 160rpx;
      height: 80rpx;
      overflow: hidden;
    }
    .name {
      max-height: 88rpx;
      margin: 20rpx;
      font-size: 32rpx;
      line-height: 1.4;
      color: #333333;
    }
    .desc {
      padding: 0 20rpx 30rpx;
      font-size: 24rpx;
      line-height: 1;
      color: #cf4444;
    }
  }
  .action {
    padding-left: 20rpx;
    .item {
      position: relative;
      display: flex;
      align-items: center;
      height: 90rpx;
      padding-right: 60rpx;
      font-size: 26rpx;
      color: #333333;
      border-bottom: 1rpx solid #eaeaea;
      &:last-child {
        border-bottom: 0 none;
      }
    }
    .label {
      width: 60rpx;
      margin: 0 16rpx 0 10rpx;
      color: #898b94;
    }
    .text {
      flex: 1;
      -webkit-line-clamp: 1;
    }
  }
}

/* 商品详情 */
.detail {
  padding-left: 20rpx;
  .content {
    margin-left: -20rpx;
    .image {
      width: 100%;
    }
  }
  .properties {
    padding: 0 20rpx;
    margin-bottom: 30rpx;
    .item {
      display: flex;
      padding: 10rpx;
      font-size: 26rpx;
      line-height: 2;
      color: #333333;
      border-bottom: 1rpx dashed #cccccc;
    }
    .label {
      width: 200rpx;
    }
    .value {
      flex: 1;
    }
  }
}

/* 同类推荐 */
.similar {
  .content {
    display: flex;
    flex-wrap: wrap;
    padding: 0 20rpx 20rpx;
    background-color: #f4f4f4;
    .goods {
      width: 340rpx;
      padding: 24rpx 20rpx 20rpx;
      margin: 20rpx 7rpx;
      background-color: #ffffff;
      border-radius: 10rpx;
    }
    .image {
      width: 300rpx;
      height: 260rpx;
    }
    .name {
      height: 80rpx;
      margin: 10rpx 0;
      font-size: 26rpx;
      color: #262626;
    }
    .price {
      font-size: 20rpx;
      line-height: 1;
      color: #cf4444;
    }
    .number {
      margin-left: 2rpx;
      font-size: 26rpx;
    }
  }
  navigator {
    &:nth-child(even) {
      margin-right: 0;
    }
  }
}

/* 底部工具栏 */
.toolbar {
  position: fixed;
  right: 0;
  bottom: calc((var(--window-bottom)));
  left: 0;
  z-index: 1;
  box-sizing: content-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100rpx;
  padding: 0 20rpx;
  background-color: #ffffff;
  border-top: 1rpx solid #eaeaea;
  .buttons {
    display: flex;
    & > view {
      width: 220rpx;
      font-size: 26rpx;
      line-height: 72rpx;
      color: #ffffff;
      text-align: center;
      border-radius: 72rpx;
    }
    .addcart {
      background-color: #ffa868;
    }
    .payment {
      margin-left: 20rpx;
      background-color: #27ba9b;
    }
  }
  .icons {
    display: flex;
    flex: 1;
    align-items: center;
    padding-right: 20rpx;

    // 兼容 H5 端和 App 端的导航链接样式
    .navigator-wrap,
    .icons-button {
      flex: 1;
      padding: 0;
      margin: 0;
      font-size: 20rpx;
      line-height: 1.4;
      color: #333333;
      text-align: center;
      background-color: #ffffff;
      border-radius: 0;
      &::after {
        border: none;
      }
    }
    text {
      display: block;
      font-size: 34rpx;
    }
  }
}
</style>
