import axios from "axios";
import {ElMessage} from 'element-plus'

const service = axios.create({
    // baseURL: 'http://localhost:3030/',
    baseURL: `${import.meta.env.VITE_API}/`, // url = base url + request url
    timeout: 30000,// request timeout
    // withCredentials:true
})
// 请求拦截
service.interceptors.request.use(
    (config: any) => {
        return config
    },
    (error: any) => {
        return Promise.reject(error)
    }
)

// 响应拦截
service.interceptors.response.use(
    (response: any) => {
        const res = response.data
        if (res.code !== 1 || res.code !== 200) {
            return response.data
        } else {
            return response.data
        }
    },
    (error: any) => {
        if (error.response) {
            switch (error.response.status) {
                case 500:
                    ElMessage({
                        message: "服务器错误，请稍后重试",
                        type: "error",
                        duration: 5 * 1000
                    })
                    break
                default:
                    if (error.response.data.error == "invalid_grant") {
                        ElMessage({
                            message: error.response.data.error_description,
                            type: "error"
                        })
                    }
                    return Promise.reject(error)
            }
        }
    }
)

export default service
