import { getData } from './index'

// 
//获取支付记录列表 
export const getPayList = (data) => { return getData('pay/list', data) }