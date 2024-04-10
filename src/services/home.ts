import type { PageParams, PageResult } from "@/types/global";
import type { BannerItem, CategoryItem, GuessItem, HotItem } from "@/types/home";
import { http } from "@/utils/http";

const imageBaseUrl = import.meta.env.VITE_IMG_BASE_URL;

/**
 * 首页-广告区域-小程序
 * @param distributionSite 广告区域展示位置（投放位置 投放位置，1为首页，2为分类商品页） 默认是1
 */
// export const getHomeBannerAPI = (distributionSite = 1) => {
//   return http<BannerItem[]>({
//     method: "GET",
//     url: "/home/banner",
//     data: {
//       distributionSite
//     }
//   });
// };

export const getHomeBannerAPI = (distributionSite = 1) => {
  const data: BannerItem[] = [
    {
      id: "23",
      imgUrl: "https://apitest.ukynda.com/images/UserSrcPic/0-0-20231208153745.jpg",
      hrefUrl: "1013001",
      type: 1
    },
    {
      id: "23",
      imgUrl: "https://apitest.ukynda.com/images/UserSrcPic/0-0-20231208153846.jpg",
      hrefUrl: "1013002",
      type: 1
    }
  ];
  return data;
};

/**
 * 首页-前台分类-小程序
 */
// export const getHomeCategoryAPI = () => {
//   return http<CategoryItem[]>({
//     method: 'GET',
//     url: '/home/category/mutli',
//   })
//}

export const getHomeCategoryAPI = () => {
  const data: CategoryItem[] = [
    {
      appId: "DailyReport",
      icon: "https://apitest.ukynda.com/images/appresource/daily-report-s.png",
      name: "运营日报",
      target: "",
      path: "/pagesDailyReport/daily-report/daily-report",
      openType: "",
      extraData: "",
      version: ""
    },
    {
      appId: "Pickup",
      icon: "https://apitest.ukynda.com/images/appresource/brand.png",
      name: "外勤接送",
      target: "",
      path: "",
      openType: "navigate",
      extraData: "",
      version: ""
    },
    {
      appId: "wxfbe30e791ec5e18e",
      icon: "https://apitest.ukynda.com/images/appresource/c3.png",
      name: "微任务",
      target: "miniProgram",
      path: "pages/index/index",
      openType: "navigate",
      extraData: "",
      version: "trial"
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
