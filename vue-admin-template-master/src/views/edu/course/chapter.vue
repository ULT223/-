<template>

    <div class="app-container">
  
      <h2 style="text-align: center;">发布新课程</h2>
  
      <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
        <el-step title="填写课程基本信息"/>
        <el-step title="创建课程大纲"/>
        <el-step title="最终发布"/>
      </el-steps>
      <el-button type="text" @click="openChapterDialog">添加章节</el-button>
    <!-- 章节 -->
    <ul class="chanpterList">
    <li
        v-for="chapter in chapterVideoList"
        :key="chapter.id">
        <p>
            {{ chapter.title }}
            <span class="acts">
              <el-button type="text" @click="openVideo(chapter.id)">添加小节</el-button>
              <el-button @click="openEditChapter(chapter.id)" type="text">编辑</el-button>
              <el-button @click="removeChapter(chapter.id)" type="text">删除</el-button>
            </span>
            
        </p>

        <!-- 视频 -->
        <ul class="chanpterList videoList">
            <li
                v-for="video in chapter.children"
                :key="video.id">
                <p>{{ video.title }}
                    <span class="acts">
                        <el-button type="text" @click="openEditVideo(video.id)">编辑</el-button>
                        <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
                    </span>
                </p>
            </li>
          </ul>
        </li>
      </ul>
      <div style="clear: both;"></div>
      <el-form label-width="120px">
        <el-form-item>
          <el-button @click="previous">上一步</el-button>
          <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
        </el-form-item>
      </el-form>

      <!-- 添加和修改章节表单 -->
      <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
          <el-form :model="chapter" label-width="120px">
              <el-form-item label="章节标题">
                  <el-input v-model="chapter.title"/>
              </el-form-item>
              <el-form-item label="章节排序">
                  <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
              </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
          </div>
      </el-dialog>
      <!-- 添加和修改课时表单 -->
      <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
        <el-form :model="video" label-width="120px">
          <el-form-item label="课时标题">
            <el-input v-model="video.title"/>
          </el-form-item>
          <el-form-item label="课时排序">
            <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
          </el-form-item>
          <el-form-item label="是否免费">
            <el-radio-group v-model="video.isFree">
              <el-radio :label="1">免费</el-radio>
              <el-radio :label="0">默认</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="上传视频">
          <el-upload
                :auto-upload="true"
                :on-success="handleVodUploadSuccess"
                :on-remove="handleVodRemove"
                :on-upload-error="handleUploadError"
                :before-remove="beforeVodRemove"
                :on-exceed="handleUploadExceed"
                :file-list="fileList"
                :action="BASE_API+'/eduvod/video/uploadAliyunVideo'"
                :limit="1"
                ref='uploadVideo'
                class="upload-demo">
          <el-button size="small" type="primary">上传视频</el-button>
          <el-tooltip placement="right-end">
              <div slot="content">最大支持1G，<br>
                  支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                  GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                  MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                  SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
              <i class="el-icon-question"/>
          </el-tooltip>
          </el-upload>
      </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
          <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  <script>
  import chapter from '@/api/edu/chapter'
  import video from '@/api/edu/video'

  export default {
    data() {
      return {
        saveBtnDisabled: false, // 保存按钮是否禁用
        courseId:'',//课程id
        chapterVideoList:[],
        chapter:{//封装章节数据
          courseId:'',
          title:'',
          sort:0
        },
        video:{
          courseId:'',
          chapterId:'',
          title: '',
          sort: 0,
          isFree: 0,
          videoSourceId: '',
          videoOriginalName:'',
          videoSourceId:''
        },
        dialogChapterFormVisible:false, //章节弹框
        dialogVideoFormVisible:false, //小节弹框
        fileList:[],
        BASE_API:process.env.BASE_API
      }
    },
  
    created() {
      //获取路由的id值
      if(this.$route.params && this.$route.params.id){
          this.courseId = this.$route.params.id
          console.log("路径参数:"+this.$route.params.id)
      }
      //根据课程id查询章节和小节
      this.getChapterVideo()
      console.log('info created')
    },
  
    methods: {

//=========================小节操作================================
      //添加小节弹框的方法
      openVideo(chapterId){
        this.video = {}
        //弹框
        this.dialogVideoFormVisible = true
        //设置章节id
        this.video.chapterId = chapterId
      },
      openEditVideo(videoId){
        this.getVideoInfo(videoId)
        //弹框
        this.dialogVideoFormVisible = true
      },
      //添加小节
      addVideo(){
        //设置课程id
        this.video.courseId = this.courseId
        video.addVideo(this.video)
        .then(response => {
          //关闭弹框
          this.dialogVideoFormVisible = false,
          //提示
          this.$message({
            type:'success',
            message: '添加小节成功!'
          })
        })
        //刷新页面
        this.getChapterVideo()
      },
      updateVideo(){
        video.updateVideo(this.video)
        .then(response => {
          //关闭弹框
          this.dialogVideoFormVisible = false
          //提示
          this.$message({
            type:'success',
            message: '修改小节成功'
          })
          //刷新页面
          this.getChapterVideo()
        })
      },
      //删除小节
      removeVideo(videoId){
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          //调用删除的方法
          video.deleteVideo(videoId)
          .then(response => { //删除成功
            //提示信息
            this.$message({
              type:'success',
              message:'删除成功!'
            })
            this.getChapterVideo()
          })
        })//点击取消，执行catch方法
      },
      getVideoInfo(videoId){
        console.log(this.chapterVideoList)
        video.getVideoInfo(videoId)
        .then(response => {
          this.video = response.data.video
          console.log(this.video)
        })
      },
      saveOrUpdateVideo(){
        if(this.video.id){
          this.updateVideo()
        }else{
          this.addVideo()
        }
      },
      //上传视频成功调用的方法
      handleVodUploadSuccess(response,file,fileList){
        //上传视频id
        this.video.videoSourceId = response.data.videoSourceId
        //上传视频名称赋值
        this.video.videoOriginalName = file.name 
      },
      handleUploadExceed(){
        this.$message.warning('想要重新上传视频，请先删除已经上传的视频')
      },
      handleUploadError(err, file, fileList) {
        // 处理上传失败的情况
        console.error('Upload error', err, file, fileList);
        this.$message.error('文件上传失败，请重试！');
    },
    handleVodRemove(){
        //调用接口的删除视频方法
        console.log(this.video.videoSourceId)
        video.deleteAliyunVideo(this.video.videoSourceId)
        .then(response => {
          //提示信息
          this.$message({
            type:'success',
            message:'删除视频成功!'
          })
          //清空文件列表
          this.fileList = []
          this.video.videoSourceId=''
          this.video.videoOriginalName = ''
        })
        .catch(error => {
            // 处理错误情况
            this.$message({
              type:'error',
              message:'上传视频失败'
            })
        });
        
    },
    beforeVodRemove(file,fileList){
      return this.$confirm(`确定移除 ${file.name}?`)
    },
//=========================章节操作==============================
      //修改章节弹框数据回显
      openEditChapter(chapterId){
        console.log("点击编辑")
        this.dialogChapterFormVisible = true
        chapter.getChapter(chapterId)
              .then(response => {
                this.chapter = response.data.chapter
              })
      },

      //弹出添加章节页面
      openChapterDialog(){
        //弹框
        this.dialogChapterFormVisible = true
        //表单数据清空
        this.chapter.title = ''
        this.chapter.sort = 0
      },
      saveOrUpdate(){
        if(!this.chapter.id){
          this.addChapter()
        }else{
          this.updateChapter()
        }
      },
      //添加章节
      addChapter(){
        this.chapter.courseId = this.courseId
        chapter.addChapter(this.chapter)
        .then(response => {
          //关闭对话框
          this.dialogChapterFormVisible = false  
          this.chapterVideoList = response.data.allChapterVideo
          this.$message({
            type:'success',
            message: '添加章节成功!'
          })
          //刷新页面
          this.getChapterVideo()
        })
      },
      //修改章节
      updateChapter() {
        chapter.updateChapter(this.chapter)
        .then(response => {
          //关闭弹框
          this.dialogChapterFormVisible = false
          //提示
          this.$message({
              type:'success',
              message:'修改章节成功!'
          })
          //刷新页面
          this.getChapterVideo()
        })
      },
      //删除章节
      removeChapter(chapterId){
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          //调用删除的方法
          chapter.deleteChapter(chapterId)
          .then(response => { //删除成功
            //提示信息
            this.$message({
              type:'success',
              message:'删除成功!'
            })
            this.getChapterVideo()
          })
        })//点击取消，执行catch方法
      },
      //根据课程id查询章节和小节
      getChapterVideo(){
        chapter.getAllChapterVideo(this.courseId)
        .then(response => {
          this.chapterVideoList = response.data.allChapterVideo
        })
      },
      previous(){
          this.$router.push({path:'/course/info/'+this.courseId})
      },
      next() {
          //跳转到第二步
          console.log('next')
          this.$router.push({ path: '/course/publish/' + this.courseId})
      }
    }
  }
  </script>

<style scoped>
.chanpterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chanpterList li{
  position: relative;
}
.chanpterList p{
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chanpterList .acts {
    float: right;
    font-size: 14px;
}

.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}

</style>