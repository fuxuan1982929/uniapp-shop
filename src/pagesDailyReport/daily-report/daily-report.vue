<script setup lang="ts">
import { ref } from "vue";
import SaleDistribute from "./components/SaleDistribute.vue";
import RegionDistribute from "./components/RegionDistribute.vue";

const tabIndex = ref(0);

const data = {
  tabIndex: 0 /* 选中标签栏的序列,默认显示第一个 */,
  tabBars: [
    {
      name: "AU",
      id: "1"
    },
    {
      name: "5G",
      id: "2"
    },
    {
      name: "古法",
      id: "3"
    },
    {
      name: "硬金",
      id: "4"
    },
    {
      name: "PT",
      id: "5"
    },
    {
      name: "PT1",
      id: "yule"
    },
    {
      name: "PT2",
      id: "yule"
    },
    {
      name: "PT3",
      id: "yule"
    },
    {
      name: "PT4",
      id: "yule"
    }
  ]
};

//切换选项卡
const toggleTab = (index: number) => {
  tabIndex.value = index;
};

//滑动切换swiper
const tabChange = (e: { detail: { current: number } }) => {
  //console.log(e.detail.current);
  tabIndex.value = e.detail.current;
};
</script>

<template>
  <view class="viewport">
    <view style="text-align: center; padding: 5px; margin-top: 5px; font-size: 22px; font-weight: bold"> 今日出货 1222.33 </view>
    <view>
      <!-- 顶部导航栏 -->
      <view class="horizonal-tab">
        <scroll-view v-bind:scroll-x="true" scroll-with-animation class="scroll-tab">
          <block v-for="(item, index) in data.tabBars" :key="index">
            <view class="scroll-tab-item" :class="{ active: tabIndex == index }" @tap="toggleTab(index)">
              <view>
                <view style="background-color: #42b983; color: #fff; padding: 5px 20px">{{ item.name }}</view>
                <view style="background-color: #ccc; color: #42b983; padding: 5px 20px">666.66</view>
              </view>
              <view class="scroll-tab-line"></view>
            </view>
          </block>
        </scroll-view>
      </view>
      <!-- 内容区 -->
      <view class="uni-margin-wrap">
        <!-- 滑块视图 -->
        <swiper class="swiper" :current="tabIndex" @change="tabChange">
          <swiper-item v-for="(content, index) in data.tabBars" :key="index">
            <uni-section :title="content.name + '公费段销售分布'" type="line">
              <SaleDistribute />
            </uni-section>
            <uni-section title="区域分布" type="line">
              <RegionDistribute />
            </uni-section>
          </swiper-item>
        </swiper>
      </view>
    </view>
  </view>
</template>
<style lang="scss">
.horizonal-tab .active {
  color: red;
}
.scroll-tab {
  white-space: nowrap; /* 必要，导航栏才能横向*/
  border-bottom: 0 solid #eee;
  text-align: center;
}
.scroll-tab-item {
  display: inline-block; /* 必要，导航栏才能横向*/
  margin: 20rpx 10rpx 0 10rpx;
}
.active .scroll-tab-line {
  border-top: 5rpx solid red;
  width: 90px;
}
.uni-margin-wrap {
  width: 690rpx;
  width: 100%;
}
.swiper {
  height: 800px;
}
</style>
