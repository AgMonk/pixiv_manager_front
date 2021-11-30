export const setTitle = (title) => {
    document.title = `PxUI - ${title}`
}

export const setTagTranslation = (body, commit) => {
    //标签翻译
    const tagTranslation = body.tagTranslation
    Object.keys(tagTranslation).forEach(key => {
        const v = tagTranslation[key]
        const zh = v.zh;
        const zhTw = v.zh_tw;
        const en = v.en;
        const value = zh ? zh : (zhTw ? zhTw : (en ? en : key));
        commit("pixivTagTranslation/setTranslation", {key, value}, {root: true});
    })
}