import { getData } from './index'

//获取支付记录列表 
export const getUsdtList = (data) => { return getData('usdt/list', data) }

//通过或者拒绝
export const setUpdate = (data) => { return getData('usdt/update', data) }