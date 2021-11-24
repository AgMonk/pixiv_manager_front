import axios from "axios";
import {ElMessage} from "element-plus";

export const request = axios.create({
    baseURL:"/api/",
    timeout:5000,
    method:"post",

})
export const pixivNetRequest = axios.create({
    baseURL:"/pixiv-net/",
    // baseURL:"/pixivNet/",
    timeout:10000,
    method:"get",
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
