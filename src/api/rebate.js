import { getData, } from './index'

//获取邀请返利列表 
export const getIncomeList = (data) => { return getData('get/income', data) }