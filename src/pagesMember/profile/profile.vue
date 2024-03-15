<script setup lang="ts">
import { getMemberProfileAPI, putMemberProfileAPI } from "@/services/profile";
import { useMemberStore } from "@/stores";
import type { Gender, ProfileDetail } from "@/types/member";
import { formatDate } from "@/utils";
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync();

// 获取个人信息，修改个人信息需提供初始值
const profile = ref({} as ProfileDetail);
const getMemberProfileData = async () => {
  const res = await getMemberProfileAPI();
  profile.value = res.result;
  // 同步 Store 的头像和昵称，用于我的页面展示
  memberStore.profile!.avatar = res.result.avatar;
  memberStore.profile!.nickname = res.result.nickname;
};

onLoad(() => {
  getMemberProfileData();
});

const memberStore = useMemberStore();
// 修改头像
const onAvatarChange = () => {
  // 调用拍照/选择图片
  // 选择图片条件编译
  // #ifdef H5 || APP-PLUS
  // 微信小程序从基础库 2.21.0 开始， wx.chooseImage 停止维护，请使用 uni.chooseMedia 代替
  uni.chooseImage({
    count: 1,
    success: res => {
      // 文件路径
      const tempFilePaths = res.tempFilePaths;
      // 上传
      uploadFile(tempFilePaths[0]);
    }
  });
  // #endif

  // #ifdef MP-WEIXIN
  // uni.chooseMedia 仅支持微信小程序端
  uni.chooseMedia({
    // 文件个数
    count: 1,
    // 文件类型
    mediaType: ["image"],
    success: res => {
      // 本地路径
      const { tempFilePath } = res.tempFiles[0];
      // 上传
      uploadFile(tempFilePath);
    }
  });
  // #endif
};

// 文件上传-兼容小程序端、H5端、App端
const uploadFile = (file: string) => {
  // 文件上传
  uni.uploadFile({
    url: "/member/profile/avatar",
    name: "file",
    filePath: file,
    success: res => {
      if (res.statusCode === 200) {
        const avatar = JSON.parse(res.data).result.avatar;
        // 个人信息页数据更新
        profile.value!.avatar = avatar;
        // Store头像更新
        memberStore.profile!.avatar = avatar;
        uni.showToast({ icon: "success", title: "更新成功" });
      } else {
        uni.showToast({ icon: "error", title: "出现错误" });
      }
    }
  });
};

// 修改性别
const onGenderChange: UniHelper.RadioGroupOnChange = ev => {
  profile.value.gender = ev.detail.value as Gender;
};

// 修改生日
const onBirthdayChange: UniHelper.DatePickerOnChange = ev => {
  profile.value.birthday = ev.detail.value;
};

// 修改城市
let fullLocationCode: [string, string, string] = ["", "", ""];
const onFullLocationChange: UniHelper.RegionPickerOnChange = ev => {
  // 修改前端界面
  profile.value.fullLocation = ev.detail.value.join(" ");
  // 提交后端更新
  fullLocationCode = ev.detail.code!;
};

// 点击保存提交表单
const onSubmit = async () => {
  const { nickname, gender, birthday } = profile.value;
  const res = await putMemberProfileAPI({
    nickname,
    gender,
    birthday,
    provinceCode: fullLocationCode[0],
    cityCode: fullLocationCode[1],
    countyCode: fullLocationCode[2]
  });
  // 更新Store昵称
  memberStore.profile!.nickname = res.result.nickname;
  uni.showToast({ icon: "success", title: "保存成功" });
  setTimeout(() => {
    uni.navigateBack();
  }, 400);
};
</script>

<template>
  <view class="viewport">
    <!-- 导航栏 -->
    <view class="navbar" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
      <navigator open-type="navigateBack" class="back icon-left" hover-class="none"></navigator>
      <view class="title">个人信息</view>
    </view>
    <!-- 头像 -->
    <view class="avatar">
      <view @tap="onAvatarChange" class="avatar-content">
        <image class="image" :src="profile?.avatar" mode="aspectFill" />
        <text class="text">点击修改头像</text>
      </view>
    </view>
    <!-- 表单 -->
    <view class="form">
      <!-- 表单内容 -->
      <view class="form-content">
        <view class="form-item">
          <text class="label">账号</text>
          <text class="account placeholder">{{ profile?.account }}</text>
        </view>
        <view class="form-item">
          <text class="label">昵称</text>
          <input class="input" type="text" placeholder="请填写昵称" v-model="profile!.nickname" />
        </view>
        <view class="form-item">
          <text class="label">性别</text>
          <radio-group @change="onGenderChange">
            <label class="radio">
              <radio value="男" color="#27ba9b" :checked="profile?.gender === '男'" />
              男
            </label>
            <label class="radio">
              <radio value="女" color="#27ba9b" :checked="profile?.gender === '女'" />
              女
            </label>
          </radio-group>
        </view>
        <view class="form-item">
          <text class="label">生日</text>
          <picker
            @change="onBirthdayChange"
            mode="date"
            class="picker"
            :value="profile?.birthday"
            start="1900-01-01"
            :end="formatDate(new Date())"
          >
            <view v-if="profile?.birthday">{{ profile?.birthday }}</view>
            <view class="placeholder" v-else>请选择日期</view>
          </picker>
        </view>
        <!-- 只有微信小程序端内置了省市区数据 -->
        <!-- #ifdef MP-WEIXIN -->
        <view class="form-item">
          <text class="label">城市</text>
          <picker @change="onFullLocationChange" mode="region" class="picker" :value="profile?.fullLocation?.split(' ')">
            <view v-if="profile?.fullLocation">{{ profile.fullLocation }}</view>
            <view class="placeholder" v-else>请选择城市</view>
          </picker>
        </view>
        <!-- #endif -->
        <view class="form-item">
          <text class="label">职业</text>
          <input class="input" type="text" placeholder="请填写职业" :value="profile?.profession" />
        </view>
      </view>
      <!-- 提交按钮 -->
      <button @tap="onSubmit" class="form-button">保 存</button>
    </view>
  </view>
</template>

<style lang="scss">
page {
  background-color: #f4f4f4;
}
.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-image: url("https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/order_bg.png");
  background-repeat: no-repeat;
  background-size: auto 420rpx;
}

// 导航栏
.navbar {
  position: relative;
  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    font-size: 16px;
    font-weight: 500;
    color: #ffffff;
  }
  .back {
    position: absolute;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    font-size: 20px;
    color: #ffffff;
  }
}

// 头像
.avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 260rpx;
  text-align: center;
  .image {
    width: 160rpx;
    height: 160rpx;
    background-color: #eeeeee;
    border-radius: 50%;
  }
  .text {
    display: block;
    padding-top: 20rpx;
    font-size: 26rpx;
    line-height: 1;
    color: #ffffff;
  }
}

// 表单
.form {
  background-color: #f4f4f4;
  &-content {
    padding: 0 20rpx;
    margin: 20rpx 20rpx 0;
    background-color: #ffffff;
    border-radius: 10rpx;
  }
  &-item {
    display: flex;
    height: 96rpx;
    padding: 25rpx 10rpx;
    font-size: 28rpx;
    line-height: 46rpx;
    background-color: #ffffff;
    border-bottom: 1rpx solid #dddddd;
    &:last-child {
      border: none;
    }
    .label {
      width: 180rpx;
      color: #333333;
    }
    .account {
      color: #666666;
    }
    .input {
      display: block;
      flex: 1;
      height: 46rpx;
    }
    .radio {
      margin-right: 20rpx;
    }
    .picker {
      flex: 1;
    }
    .placeholder {
      color: #808080;
    }
  }
  &-button {
    height: 80rpx;
    margin: 30rpx 20rpx;
    font-size: 30rpx;
    line-height: 80rpx;
    color: #ffffff;
    text-align: center;
    background-color: #27ba9b;
    border-radius: 80rpx;
  }
}
</style>
