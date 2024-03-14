import request from '@/utils/request'

export default{
    //1 讲师列表(条件分页查询)
    getTeacherListPage(current,limit,teacherQuery){
        return request({
        //url:'/table/list' + current + "/" + limit,
          url:`/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,
          method:'post',
          //teacherQuery推荐对象,后端用RequestBody获取数据
          //data表示把对象转换json传递到接口里面
          data:teacherQuery
        })
    },
    deleteTeacher(id){
        return request({
          url:`/eduservice/teacher/${id}`,
          method:'delete',
        })
    },
    addTeacher(teacher){
      return request({
        url:`/eduservice/teacher/addTeacher`,
        method:'post',
        data:teacher
      })
    },
    getTeacherInfo(id){
      return request({
        url:`/eduservice/teacher/getTeacher/${id}`,
        method:'get'
      })
    },
    updateTeacher(teacher){
      return request({
        url:`/eduservice/teacher/updateTeacher`,
        method:'post',
        data:teacher
      })
    }
}
