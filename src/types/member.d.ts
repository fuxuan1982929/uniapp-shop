/** 通用的用户信息 */
type BaseProfile = {
  /** 用户ID */
  Id: number;
  /** 部门  */
  DepartId: number;
  /** ERP */
  BaseType: number;
  /** 头像  */
  //avatar: string;
  /** 账户名  */
  Number: string;
  /** 昵称 */
  Name?: string;
};

/** 小程序登录 登录用户信息 */
export type LoginResult = BaseProfile & {
  /** 手机号 */
  //mobile: string;
  /** 登录凭证 */
  Token: string;
  /**成功标记 */
  Success: boolean;
  /**错误信息 */
  ErrorMsg: string;
};

/** 个人信息 用户详情信息 */
export type ProfileDetail = BaseProfile & {
  /** 性别 */
  gender?: Gender;
  /** 生日 */
  birthday?: string;
  /** 省市区 */
  fullLocation?: string;
  /** 职业 */
  profession?: string;
};
/** 性别 */
export type Gender = "女" | "男";

/** 个人信息 修改请求体参数 */
export type ProfileParams = Pick<ProfileDetail, "nickname" | "gender" | "birthday" | "profession"> & {
  /** 省份编码 */
  provinceCode?: string;
  /** 城市编码 */
  cityCode?: string;
  /** 区/县编码 */
  countyCode?: string;
};
