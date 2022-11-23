//引入axios
import axios from 'axios'
//创建一个新的axios实例
const HttpRequest = axios.create({
    baseURL: 'http://localhost:8099',
    //设置超时时间，超过该时间就不会发起请求
    timeout: 3000
})
HttpRequest.interceptors.request.use(
    config => {
        //？？？？？
        config.headers = {
            'Content-Type': 'application/json' //配置请求头
        }
        config.headers["token"] = "bcyeqbfuhwrufbruwbguerng"//配置token
        return config
    },
    error => {
        console.log(error);
        return Promise.reject(error)
    }
)
HttpRequest.interceptors.response.use(
    //请求成功处理
    response => {
        const res = response
        if (res.code === 0) {
            return res
        }
    },
    error => {
        // Message.error(error.message)
        if (JSON.stringify(error).includes('timeout')) {
            alert("错误")
        }
    }
)
export default HttpRequest
