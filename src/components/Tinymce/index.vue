<template>
  <div class="tinymce-container editor-container">
    <textarea class="tinymce-textarea" :id="tinymceId"></textarea>
    <div class="editor-custom-btn-container">
     <!--<editorImage  color="#20a0ff" class="editor-upload-btn" @successCBK="imageSuccessCBK"></editorImage>-->
      <el-button type="success" @click="submitAll">Submit</el-button>
      </div>
  </div>
</template>

<script>
import editorImage from './components/editorImage'

export default {
  name: 'tinymce',
  components: {
    editorImage },
  props: {
    templateName: {
      type: String,
      default: ''
    },
    templateCategory: {
      type: Array,
      default: []
    },
    id: {
      type: String
    },
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default () {
//        return ['removeformat undo redo |  bullist numlist | outdent indent | forecolor | fullscreen code', 'bold italic blockquote | h2 p  media link | alignleft aligncenter alignright']
        return ['formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat']
      }
    },
    menubar: {
      default: ''
    },
    height: {
      type: Number,
      required: false,
      default: 360
    }
  },
  data () {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id || 'vue-tinymce-' + +new Date()
    }
  },
  watch: {
    value (val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() => window.tinymce.get(this.tinymceId).setContent(val))
      }
    }
  },
  mounted () {
    this.initTinymce()
  },
  activated () {
    this.initTinymce()
  },
  deactivated () {
    this.destroyTinymce()
  },
  methods: {
    initTinymce () {
      const _this = this
      window.tinymce.init({
//        selector: 'textarea',
        selector: `#${this.tinymceId}`,
        height: 500,
        theme: 'modern',
        plugins: 'print preview fullpage paste searchreplace autolink directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount imagetools media link contextmenu colorpicker textpattern help',
        toolbar1: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
        image_advtab: true,
        templates: [
          { title: 'Test template 1', content: 'Test 1' },
          { title: 'Test template 2', content: 'Test 2' }
        ],
        init_instance_callback: editor => {
          if (_this.value) {
            editor.setContent(_this.value)
          }
          _this.hasInit = true
          editor.on('NodeChange Change KeyUp', () => {
            this.hasChange = true
            this.$emit('input', editor.getContent({ format: 'raw' }))
          })
        }
        // 整合七牛上传
        // images_dataimg_filter(img) {
        //   setTimeout(() => {
        //     const $image = $(img);
        //     $image.removeAttr('width');
        //     $image.removeAttr('height');
        //     if ($image[0].height && $image[0].width) {
        //       $image.attr('data-wscntype', 'image');
        //       $image.attr('data-wscnh', $image[0].height);
        //       $image.attr('data-wscnw', $image[0].width);
        //       $image.addClass('wscnph');
        //     }
        //   }, 0);
        //   return img
        // },
        // images_upload_handler(blobInfo, success, failure, progress) {
        //   progress(0);
        //   const token = _this.$store.getters.token;
        //   getToken(token).then(response => {
        //     const url = response.data.qiniu_url;
        //     const formData = new FormData();
        //     formData.append('token', response.data.qiniu_token);
        //     formData.append('key', response.data.qiniu_key);
        //     formData.append('file', blobInfo.blob(), url);
        //     upload(formData).then(() => {
        //       success(url);
        //       progress(100);
        //     })
        //   }).catch(err => {
        //     failure('出现未知问题，刷新页面，或者联系程序员')
        //     console.log(err);
        //   });
        // },
      })
    },
    destroyTinymce () {
      if (window.tinymce.get(this.tinymceId)) {
        window.tinymce.get(this.tinymceId).destroy()
      }
    },
    setContent (value) {
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    getContent () {
      window.tinymce.get(this.tinymceId).getContent()
    },
    imageSuccessCBK (arr) {
      const _this = this
      arr.forEach(v => {
        window.tinymce.get(_this.tinymceId).insertContent(`<img class="wscnph" src="${v.url}" >`)
      })
    },
    submitAll () {
        // 提交创建好的模板
      let self = this
      if (self.templateName === '') {
        this.$message({
          message: 'Please Enter Template Name',
          type: 'error',
          duration: 2000
        })
        return
      }
      if (self.templateCategory.length === 0) {
        this.$message({
          message: 'Please Select Template Category',
          type: 'error',
          duration: 2000
        })
        return
      }
      self.$axios({
//        url: `/admin/createTemplate`,
//        url: `http://192.168.0.15:5000/admin/createTemplate`,
        url: `http://121.42.252.18:5000/admin/createTemplate`,
        method: 'post',
        data: {
          template_name: self.templateName,
          template_category: self.templateCategory,
          html: window.tinymce.get(this.tinymceId).getContent()
        }
      }).then((res) => {
        if (res.data.result === 'success') {
          self.historyTable = res.data.history
          this.$message({
            message: 'Submitted successfully!',
            type: 'success',
            duration: 2000
          })
//          console.log(self.historyTable)
        } else if (res.data.result === 'failure') {
          let errorMessage = res.data.errorMessage
          this.$message({
            message: errorMessage,
            type: 'error',
            duration: 2000
          })
        }
      }).catch(function (error) {
        console.log(error)
      })
//      console.log(window.tinymce.get(this.tinymceId).getContent())
//      console.log(this.templateName)
    }
  },
  destroyed () {
    this.destroyTinymce()
  }
}
</script>

<style scoped>
.tinymce-container {
  position: relative
}
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
.editor-custom-btn-container {
  position: absolute;
  right: 15px;
  /*z-index: 2005;*/
  top: 18px;
}
.editor-upload-btn {
  display: inline-block;
}
</style>
