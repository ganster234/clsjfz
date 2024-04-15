import { getData, } from './index'

// 获取验证码
export const getCode = (data) => { return getData('verifyCode', data) }