import type { GoodsItem } from "./global";

/** 首页-广告区域数据类型 */
export type BannerItem = {
  /** 跳转链接 */
  hrefUrl: string;
  /** id */
  id: string;
  /** 图片链接 */
  imgUrl: string;
  /** 跳转类型 */
  type: number;
};

/** 首页-前台类目数据类型 */
export type CategoryItem = {
  /** 图标路径 */
  icon: string;
  /** appId */
  appId: string;
  /** 分类名称 */
  name: string;
  /** 在哪个目标上发生跳转，默认当前小程序;默认值self */
  target: string;
  /** 跳转链接*/
  path: string;
  /** 跳转方式;值为navigate对应wx.navigateToMiniProgram的功能 */
  openType: string;
  /** 当target="miniProgram"时有效，需要传递给目标小程序的数据 */
  extraData: string;
  /** version:当target="miniProgram"时有效，要打开的小程序版本;develop 开发版、 trial 体验版、 release 正式版。 */
  version: string;
};

/** 首页-热门推荐数据类型 */
export type HotItem = {
  /** 说明 */
  alt: string;
  /** id */
  id: string;
  /** 图片集合[ 图片路径 ] */
  pictures: string[];
  /** 跳转地址 */
  target: string;
  /** 标题 */
  title: string;
  /** 推荐类型 */
  type: string;
};

/** 猜你喜欢-商品类型 */
export type GuessItem = GoodsItem;
