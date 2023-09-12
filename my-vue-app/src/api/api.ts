import request from "./request";

export function getUniteLoginUrl(params: any) {
    return request({
        url: '/',
        method: 'get',
        params
    })
}
