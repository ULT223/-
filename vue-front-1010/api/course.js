import request from '@/utils/request'

export default{
    //条件分页查询课程的方法
    getCourseList(page,limit,courseSearch){
        return request({
            url:`/eduservice/coursefront/getFrontCourseList/${page}/${limit}`,
            method:'post',
            data:courseSearch
        })
    },
    //查询所有分类的方法
    getAllSubject(){
        return request({
            url:'/eduservice/subject/getAllSubject',
            method:'get'
        })
    },
    //课程详情
    getCourseInfo(courseId){
            return request({
            url:`/eduservice/coursefront/getFrontCourseInfo/${courseId}`,
            method:'get'
        })
    }
}