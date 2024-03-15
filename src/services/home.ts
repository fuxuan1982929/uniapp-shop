import type { PageParams, PageResult } from "@/types/global";
import type { BannerItem, CategoryItem, GuessItem, HotItem } from "@/types/home";
import { http } from "@/utils/http";

/**
 * 首页-广告区域-小程序
 * @param distributionSite 广告区域展示位置（投放位置 投放位置，1为首页，2为分类商品页） 默认是1
 */
export const getHomeBannerAPI = (distributionSite = 1) => {
  return http<BannerItem[]>({
    method: "GET",
    url: "/home/banner",
    data: {
      distributionSite
    }
  });
};

/**
 * 首页-前台分类-小程序
 */
// export const getHomeCategoryAPI = () => {
//   return http<CategoryItem[]>({
//     method: 'GET',
//     url: '/home/category/mutli',
//   })
// }

export const getHomeCategoryAPI = () => {
  const data: CategoryItem[] = [
    {
      id: "aa",
      icon: "http://yjy-xiaotuxian-dev.oss-cn-beijing.aliyuncs.com/picture/2021-05-06/201516e3-25d0-48f5-bcee-7f0cafb14176.png?quality=95&imageView",
      name: "外勤接送"
    },
    {
      id: "bb",
      icon: "http://yjy-xiaotuxian-dev.oss-cn-beijing.aliyuncs.com/picture/2021-05-06/201516e3-25d0-48f5-bcee-7f0cafb14176.png?quality=95&imageView",
      name: "微任务"
    }
  ];
  return data;
};

/**
 * 首页-热门推荐-小程序
 */
export const getHomeHotAPI = () => {
  return http<HotItem[]>({
    method: "GET",
    url: "/home/hot/mutli"
  });
};

/**
 * 猜你喜欢-小程序
 */
export const getHomeGoodsGuessLikeAPI = (data?: PageParams) => {
  return http<PageResult<GuessItem>>({
    method: "GET",
    url: "/home/goods/guessLike",
    data
  });
};
