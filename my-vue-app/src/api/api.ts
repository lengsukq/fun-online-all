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
            url: '/users/changeUser',
            method: 'get',
            params: params
        })
    },
    addUser(params: any) {
        return request({
            url: '/users/addUser',
            headers: {
                "Content-Type": "application/json"
            },
            method: 'post',
            data:params
        })
    }
}

export default apiHttp;
