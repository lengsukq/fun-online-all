import request from "./request";

const apiHttp = {
    getUniteLoginUrl() {
        return request({
            url: '/',
            method: 'get',
        })
    },
    changeInfo(params: any) {
        return request({
            url: '/users/changeName',
            method: 'get',
            params:params
        })
    }
}

export default apiHttp;
