<script setup lang="ts">
import { postLoginAPI, postLoginWxMinAPI, postLoginWxMinSimpleAPI } from "@/services/login";
import { useMemberStore } from "@/stores";
import type { LoginResult } from "@/types/member";
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";
//非prod则为测试环境
const env = !import.meta.env.PROD;
const imageBaseUrl = import.meta.env.VITE_IMG_BASE_URL;

// 获取 code 登录凭证
let code = "";
onLoad(async () => {
  const res = await wx.login();
  code = res.code;
});

// 获取用户手机号码
const onGetphonenumber: UniHelper.ButtonOnGetphonenumber = async ev => {
  const { encryptedData, iv } = ev.detail;
  const res = await postLoginWxMinAPI({ code, encryptedData, iv });
  loginSuccess(res.data);
};

const loginSuccess = (profile: LoginResult) => {
  // 保存会员信息
  const memberStore = useMemberStore();
  memberStore.setProfile(profile);
  // 成功提示
  uni.showToast({ icon: "success", title: "登录成功" });
  setTimeout(() => {
    // 页面跳转
    // uni.switchTab({ url: '/pages/my/my' })
    uni.navigateBack();
  }, 500);
};

const form = ref({
  Number: "",
  PassWord: ""
});

// 表单提交
const onSubmit = async () => {
  const res = await postLoginAPI(form.value);
  loginSuccess(res.data);
};
</script>

<template>
  <view class="viewport">
    <view class="logo">
      <image :src="`${imageBaseUrl}/swiky_logo_head.png`"></image>
    </view>
    <view v-if="env" class="env">**测试环境**</view>
    <view class="login">
      <input v-model="form.Number" class="input" type="text" placeholder="请输入用户名/手机号码" />
      <input v-model="form.PassWord" class="input" type="text" password placeholder="请输入密码" />
      <button @tap="onSubmit" class="button phone">登录</button>
      <view class="extra">
        <view class="caption">
          <text>其他登录方式</text>
        </view>
        <view class="options">
          <!-- 小程序端授权登录 -->
          <button open-type="getPhoneNumber" @getphonenumber="onGetphonenumber">
            <text class="icon icon-phone">手机号快捷登录</text>
          </button>
        </view>
      </view>
      <view class="tips">登录/注册即视为你同意《服务条款》和《隐私协议》</view>
    </view>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
}
.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20rpx 40rpx;
}
.logo {
  flex: 1;
  text-align: center;
  image {
    width: 80%;
    height: 80%;
    border-radius: 20rpx;
  }
  margin-top: 10vh;
}
.login {
  display: flex;
  flex-direction: column;
  height: 60vh;
  padding: 40rpx 20rpx 20rpx;
  .input {
    width: 100%;
    height: 80rpx;
    padding-left: 30rpx;
    margin-bottom: 20rpx;
    font-size: 28rpx;
    border: 1px solid #dddddd;
    border-radius: 72rpx;
  }
  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 80rpx;
    font-size: 28rpx;
    color: #ffffff;
    border-radius: 72rpx;
    .icon {
      margin-right: 6rpx;
      font-size: 40rpx;
    }
  }
  .phone {
    background-color: #e00180;
  }
  .wechat {
    background-color: #e00180;
  }
  .extra {
    flex: 1;
    padding: 70rpx 70rpx 0;
    .caption {
      position: relative;
      width: 440rpx;
      font-size: 26rpx;
      line-height: 1;
      color: #999999;
      border-top: 1rpx solid #dddddd;
      text {
        position: absolute;
        top: -12rpx;
        left: 50%;
        background-color: #ffffff;
        transform: translate(-40%);
      }
    }
    .options {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 70rpx;
      button {
        padding: 0;
        background-color: transparent;
        &::after {
          border: none;
        }
      }
    }
    .icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 24rpx;
      color: #444444;
      &::before {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80rpx;
        height: 80rpx;
        margin-bottom: 6rpx;
        font-size: 40rpx;
        border: 1rpx solid #444444;
        border-radius: 50%;
      }
    }
    .icon-weixin::before {
      color: #06c05f;
      border-color: #06c05f;
    }
  }
}
.tips {
  position: absolute;
  right: 20rpx;
  bottom: 80rpx;
  left: 20rpx;
  font-size: 22rpx;
  color: #999999;
  text-align: center;
}
.env {
  text-align: center;
  color: #e00180;
  font-weight: bold;
}
</style>
