import request from '@/utils/request'

export default {
    sendCode(phone){
        return request({
            url:`/edumsm/msm/send/${phone}`,
            method:'get'
        })
    },

    //注册的方法
    registerMember(formItem){
        return request({
            url:`/educenter/member/register`,
            method:'post',
            data:formItem
        })
    }
}