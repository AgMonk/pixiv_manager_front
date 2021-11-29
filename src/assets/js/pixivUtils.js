const keys = ['profileImageUrl', 'url'];

//移除数组中url的 pixiv.net 前缀
export const replacePixivNetArray = (array) => {
    array.forEach(item => replacePixivNetOne(item))
}
//移除单个对象中url的 pixiv.net 前缀
export const replacePixivNetOne = (item) => {
    keys.forEach(key => {
        //如果字段存在 且字段值为字符串
        if (item.hasOwnProperty(key) && typeof item[key] === 'string') {
            item[key] = item[key].replace("https://i.pximg.net", "").replace('https://s.pximg.net/common/images/no_profile_s.png', '')
        }
    })
}
//添加domain
export const addDomains = (array, domain) => {
    array.forEach(item => addDomain(item, domain))
}

//添加domain
export const addDomain = (item, domain) => {
    keys.forEach(key => {
        //如果字段存在 且字段值为字符串
        if (item.hasOwnProperty(key) && typeof item[key] === 'string' && item[key].length > 0) {
            item[key] = domain + item[key]
        }
    })
}