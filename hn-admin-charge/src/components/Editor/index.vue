<template>
  <div>
    <el-upload class="uploadder-ed" :action="uploadUrl" :before-upload="handleBeforeUpload"
      :on-success="handleUploadSuccess" :on-error="handleUploadError" name="file" :show-file-list="false"
      style="display: none" ref="uploadder-ed" v-if="this.type == 'url'" :headers="headers">
    </el-upload>
    <el-upload class="upload-demo" name="file" :action="uploadUrl" :show-file-list="false" style="display: none"
      :on-success="handleVideoSuccess" ref="upload-demo" v-if="this.type == 'url'" :headers="headers">
    </el-upload>
    <div class="editor" ref="editor" :style="styles"></div>
  </div>
</template>

<script>
  import Quill from "quill";
  import {
    quillRedefine
  } from 'vue-quill-editor-upload'
  import "quill/dist/quill.core.css";
  import "quill/dist/quill.snow.css";
  import "quill/dist/quill.bubble.css";
  import {
    getToken
  } from "@/utils/auth";
  const BlockEmbed = Quill.import('blots/block/embed')
  class VideoBlot extends BlockEmbed {
    static create(value) {
      let node = super.create()
      node.setAttribute('src', value.url)
      node.setAttribute('controls', value.controls)
      node.setAttribute('width', value.width)
      node.setAttribute('height', value.height)
      node.setAttribute('webkit-playsinline', true)
      node.setAttribute('playsinline', true)
      node.setAttribute('x5-playsinline', true)
      return node;
    }

    static value(node) {
      return {
        url: node.getAttribute('src'),
        controls: node.getAttribute('controls'),
        width: node.getAttribute('width'),
        height: node.getAttribute('height')
      };
    }
  }
  VideoBlot.blotName = 'simpleVideo'
  VideoBlot.tagName = 'video'
  Quill.register(VideoBlot)


  export default {
    name: "Editor",
    props: {
      /* 编辑器的内容 */
      value: {
        type: String,
        default: "",
      },
			/* 宽度 */
			maxWidth: {
			  type: Number,
			  default: null,
			},
      /* 高度 */
      height: {
        type: Number,
        default: null,
      },
      /* 最小高度 */
      minHeight: {
        type: Number,
        default: null,
      },
      /* 只读 */
      readOnly: {
        type: Boolean,
        default: false,
      },
      // 上传文件大小限制(MB)
      fileSize: {
        type: Number,
        default: 5,
      },
      /* 类型（base64格式、url格式） */
      type: {
        type: String,
        default: "url",
      }
    },
    components: {
      quillRedefine
    },
    data() {
      return {
        uploadUrl: process.env.VUE_APP_BASE_API + "/upload/image/upload", // 上传的图片服务器地址
        headers: {
          PLATFORM: 'pc',
          token: getToken()
        },
        Quill: null,
        uploadType: '',
        currentValue: "",
        options: {
          theme: "snow",
          bounds: document.body,
          debug: "warn",
          modules: {
            // 工具栏配置
            toolbar: {
              container: [
                ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
                ["blockquote", "code-block"], // 引用  代码块
                [{
                  list: "ordered"
                }, {
                  list: "bullet"
                }], // 有序、无序列表
                [{
                  indent: "-1"
                }, {
                  indent: "+1"
                }], // 缩进
                [{
                  size: ["small", false, "large", "huge"]
                }], // 字体大小
                [{
                  header: [1, 2, 3, 4, 5, 6, false]
                }], // 标题
                [{
                  color: []
                }, {
                  background: []
                }], // 字体颜色、字体背景颜色
                [{
                  align: []
                }], // 对齐方式
                ["clean"], // 清除文本格式
                ["link", "image"],
                //["link", "image", "video"], // 链接、图片、视频
              ],
              handlers: {
                'image': function(value) {
                  if (value) {
                    // 触发input框选择图片文件
                    // document.querySelector('.uploadder-ed input').click()
					this.container.parentElement.querySelector('.uploadder-ed input').click()
                  } else {
                    this.quill.format('image', false);
                  }
                },
                'video': function(value) {
                  if (value) {
                    // 触发input框选择图片文件
                    // document.querySelector('.upload-demo input').click()
					this.container.parentElement.querySelector('.upload-demo input').click()
                    // this.quill.getModule("toolbar").addHandler("video", this.uploadVideoHandler)
                  } else {
                    this.Quill.format('video', false);
                  }
                }
              }

            },
          },
          placeholder: "请输入内容",
          readOnly: this.readOnly,
          lenIndex: 0
        },
      };
    },
    computed: {
      styles() {
        let style = {};
        if (this.minHeight) {
          style.minHeight = `${this.minHeight}px`;
        }
        if (this.height) {
          style.height = `${this.height}px`;
        }
				if (this.maxWidth) {
				  style.maxWidth = `${this.maxWidth}px`;
				}
        return style;
      },
    },
    watch: {
      value: {
        handler(val) {
          if (val !== this.currentValue) {
            this.currentValue = val === null ? "" : val;
            if (this.Quill) {
              this.Quill.pasteHTML(this.currentValue);
            }
          }
        },
        immediate: true,
      },
    },
    mounted() {		
      this.init();	 
    },
    beforeDestroy() {
      this.Quill = null;
    },
    methods: {
      init() {
        const editor = this.$refs.editor;
        this.Quill = new Quill(editor, this.options);
		// 取消自动聚焦 start
		      this.Quill.enable(false);
			  setTimeout(() => {
			    this.Quill.enable(true);
			  }, 500);			
		      // this.$nextTick(()=>{
		      //     this.Quill.enable(true);
		      // });
		      // 取消自动聚焦 end
        // 如果设置了上传地址则自定义图片上传事件
        /*  if (this.type == 'url') {
            let toolbar = this.Quill.getModule("toolbar");
            toolbar.addHandler("image", (value) => {
              this.uploadType = "image";
              if (value) {
                this.$refs.upload.$children[0].$refs.input.click();
              } else {
                this.quill.format("image", false);
              }
            });
            toolbar.addHandler("video", (value) => {
              this.uploadType = "video";
              if (value) {
                this.$refs.upload.$children[0].$refs.input.click();
              } else {
                this.quill.format("video", false);
              }
            });
          }*/
        this.Quill.pasteHTML(this.currentValue);
        this.Quill.on("text-change", (delta, oldDelta, source) => {
          const html = this.$refs.editor.children[0].innerHTML;
          const text = this.Quill.getText();
          const quill = this.Quill;
          this.currentValue = html;
          this.$emit("input", html);
          this.$emit("on-change", {
            html,
            text,
            quill
          });
        });
        this.Quill.on("text-change", (delta, oldDelta, source) => {
          this.$emit("on-text-change", delta, oldDelta, source);
        });
        this.Quill.on("selection-change", (range, oldRange, source) => {
          this.$emit("on-selection-change", range, oldRange, source);
        });
        this.Quill.on("editor-change", (eventName, ...args) => {
          this.$emit("on-editor-change", eventName, ...args);
        });
      },
      // 上传前校检格式和大小
      handleBeforeUpload(file) {
        // 校检文件大小
        if (this.fileSize) {
          const isLt = file.size / 1024 / 1024 < this.fileSize;
          if (!isLt) {
            this.$message.error(`上传文件大小不能超过 ${this.fileSize} MB!`);
            return false;
          }
        }
        return true;
      },
      handleUploadSuccess(res, file) {
        // 获取富文本组件实例
        let quill = this.Quill;
        // 如果上传成功
        if (res.code == 1) {
          // 获取光标所在位置
          const addImageRange = quill.getSelection()
          const newRange = 0 + (addImageRange !== null ? addImageRange.index : 0)
          // 插入图片  res.url为服务器返回的图片地址
          quill.insertEmbed(newRange, "image", res.data);
          // 调整光标到最后
          quill.setSelection(newRange + 1);
        } else {
          this.$message.error("图片插入失败");
        }
      },
      handleVideoSuccess(response, file, fileList) {
        console.log(">>>>data", response.data, response.data)
        if (response.code == 1) { // 更好的解决方法是简单的添加一个video元素，而不是iframe，我们需要定制一个Video Embed。
          const addImageRange = this.Quill.getSelection()
          const newRange = 0 + (addImageRange !== null ? addImageRange.index : 0)
          this.Quill.insertEmbed(newRange, 'simpleVideo', {
            url: response.data,
            controls: 'controls',
            width: '100%',
            height: '30%'
          })
          this.Quill.setSelection(1 + newRange)
        }
      },
      handleUploadError() {
        this.$message.error("图片插入失败");
      },
    },
  };
</script>

<style>
  .editor,
  .ql-toolbar {
    white-space: pre-wrap !important;
    line-height: normal !important;
  }

  .quill-img {
    display: none;
  }

  .ql-snow .ql-tooltip[data-mode="link"]::before {
    content: "请输入链接地址:";
  }

  .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
    border-right: 0px;
    content: "保存";
    padding-right: 0px;
  }

  .ql-snow .ql-tooltip[data-mode="video"]::before {
    content: "请输入视频地址:";
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item::before {
    content: "14px";
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
    content: "10px";
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
    content: "18px";
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
    content: "32px";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item::before {
    content: "文本";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: "标题1";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: "标题2";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: "标题3";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: "标题4";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    content: "标题5";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    content: "标题6";
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item::before {
    content: "标准字体";
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
    content: "衬线字体";
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
    content: "等宽字体";
  }
</style>
