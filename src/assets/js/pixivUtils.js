//移除数组中url的 pixiv.net 前缀
export const replacePixivNetArray = (array) =>{
    array.forEach(item=>{replacePixivNetOne(item)})
}
//移除单个对象中url的 pixiv.net 前缀
export const replacePixivNetOne = (item) => {
    const keys =['profileImageUrl','url'];
    keys.forEach(key=>{
        //如果字段存在 且字段值为字符串
        if (item.hasOwnProperty(key) && typeof item[key] ==='string'){
            item[key] = item[key].replace("https://i.pximg.net", "")
        }
    })
}