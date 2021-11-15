import axios from "axios";
import {ElMessage} from "element-plus";

export const request = axios.create({
    baseURL:"/api/",
    timeout:5000,
    method:"post",

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
