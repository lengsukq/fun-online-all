import request from "./request";

const apiHttp = {
    getUniteLoginUrl() {
        return request({
            url: '/users/getSUsersInfo',
            method: 'get',
        })
    },
    changeInfo(params: any) {
        return request({
            url: '/users/changeName',
            method: 'get',
            params: params
        })
    }
}

export default apiHttp;
