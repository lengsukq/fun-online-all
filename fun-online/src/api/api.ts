import request from "./request";

const apiHttp = {
    verifyFunAdmin(params: any) {
        return request({
            url: '/verify/fun-admin',
            method: 'get',
            params: params
        })
    },
    verifyNavList() {
        return request({
            url: '/verify/nav-list',
            method: 'get',
        })
    },
    getUniteLoginUrl(params: any) {
        return request({
            url: '/users/getSUsersInfo',
            method: 'get',
            params: params
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
    },
    deleteUser(params: any) {
        return request({
            url: '/users/deleteUser',
            headers: {
                "Content-Type": "application/json"
            },
            method: 'delete',
            data:params
        })
    }
}

export default apiHttp;
