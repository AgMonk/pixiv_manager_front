import axios from "axios";

const timeoutPattern = /timeout of (\d+)ms exceeded/g

const onRejected = (error) => {
    let matcher = timeoutPattern.exec(error);
    if (matcher) {
        let seconds = parseInt(matcher[1]) / 1000;
        throw `请求超时 (${seconds} 秒) 请重试`;
    }
    console.error(error)
    throw error;
}

export const request = axios.create({
    baseURL: "/api/",
    timeout: 5000,
    method: "post",

})
//get请求
export const pixivNetRequest = axios.create({
    baseURL: "/pixiv-net/",
    timeout: 20000,
    method: "get",
    // headers: {
    //     'Cache-Control': 'no cache'
    // }
})
//常规post请求
export const pixivNetPostRequest = axios.create({
    baseURL: "/pixiv-net/",
    timeout: 20000,
    method: "post",
})
//formData post请求
export const pixivNetPostFormDataRequest = axios.create({
    baseURL: "/pixiv-net/",
    timeout: 20000,
    method: "post",
    transformRequest: [
        function (data) {
            let ret = ''
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            ret = ret.substring(0, ret.lastIndexOf('&'));
            return ret
        }
    ],
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    }
})


request.interceptors.response.use(response => {
    // return response.data
    let data = response.data;
    if (data.code === 2000) {
        return data
    }
    // ElMessage.error(data.message);
    throw data;
}, onRejected);
pixivNetRequest.interceptors.response.use(response => {
    // return response.data
    let data = response.data;
    if (data.error) {
        throw data.message
    }
    if (!data.body) {
        console.log(response)
        throw "请求结果为空，请重试";
    }
    return data.body;
}, onRejected);
pixivNetPostRequest.interceptors.response.use(response => {
    // return response.data
    let data = response.data;
    if (data.error) {
        throw data.message
    }
    if (!data.body) {
        console.log(response)
        throw "请求结果为空，请重试";
    }
    return data.body;
}, onRejected);
pixivNetPostFormDataRequest.interceptors.response.use(response => {
    // return response.data
    return response.data;
}, onRejected);
