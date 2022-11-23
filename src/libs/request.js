import axios from "axios";

const service = axios.create({
    baseURL: 'http://localhost:8099',
    timeout: 10000,
})

// 请求拦截器
service.interceptors.request.use(config=>{
    return config
},err=>{
    return Promise.reject(err)  //返回错误
})

// 响应拦截器
service.interceptors.response.use(res=>{
    return res
},err=>{
    return Promise.reject(err)  //返回错误
})


export default service
