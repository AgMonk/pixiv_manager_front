import axios from "axios";
import {ElMessage} from "element-plus";

export const request = axios.create({
    baseURL: "/api/",
    timeout: 5000,
    method: "post",

})
export const pixivNetRequest = axios.create({
    baseURL: "/pixiv-net/",
    timeout: 10000,
    method: "get",
    // headers: {
    //     'Cache-Control': 'no cache'
    // }
})

export const pixivNetPostRequest = axios.create({
    baseURL: "/pixiv-net/",
    timeout: 10000,
    method: "post",
})

export const pixivNetPostFormDataRequest = axios.create({
    baseURL: "/pixiv-net/",
    timeout: 10000,
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
}, (error) => {
    console.error(error)
    ElMessage.error(error.message);
    return Promise.reject(error)
});
pixivNetRequest.interceptors.response.use(response => {
    // return response.data
    let data = response.data;
    if (data.error) {
        throw data.message
    }
    return data.body;
}, (error) => {
    console.error(error)
    ElMessage.error(error.message);
    return Promise.reject(error)
});
pixivNetPostRequest.interceptors.response.use(response => {
    // return response.data
    let data = response.data;
    if (data.error) {
        throw data.message
    }
    return data.body;
}, (error) => {
    console.error(error)
    ElMessage.error(error.message);
    return Promise.reject(error)
});
pixivNetPostFormDataRequest.interceptors.response.use(response => {
    // return response.data
    return response.data;
}, (error) => {
    console.error(error)
    ElMessage.error(error.message);
    return Promise.reject(error)
});
