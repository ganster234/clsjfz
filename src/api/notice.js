import { getData,postData } from './index'

// 获取公告 
export const getNotice = (data) => { return getData('getNotice', data) }

//更新公告
export const postUpdateNotice = (data) => { return postData('notice/update', data) }