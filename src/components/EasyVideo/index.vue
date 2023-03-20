<template>
  <div>
    <video-player
      class="video-player vjs-custom-skin"
      ref="videoPlayer"
      :playsinline="true"
      :options="playerOptions"
      @play="onPlayerPlay($event)"
      @pause="onPlayerPause($event)"
      @ended="onPlayerEnded($event)"
    ></video-player>
  </div>
</template>

<script>
  import { videoPlayer } from 'vue-video-player'
  import 'video.js/dist/video-js.css'

  export default {
    name: 'easyVideo',
    components: {
      videoPlayer
    },
    props:{
      videoPath:{
        type:String,
        default:''
      },
      poster:{
        type:String,
        default:''
      }
    },
    data() {
      return {
        canOpen: true,
        noOpen: true,
        // 视频播放
        playerOptions: {}
      }
    },
    watch:{
      videoPath(val){
        console.log("视频地址",val)
        this.getDetailData();
      }
    },
    created() {
      this.getDetailData()
    },
    methods: {
      //获取详细的数据
      getDetailData() {
          this.playerOptions = {
            playbackRates: [0.5, 1.0, 1.5, 2.0], //可选择的播放速度
            autoplay: false, //如果true,浏览器准备好时开始回放。
            muted: false, // 默认情况下将会消除任何音频。
            loop: false, // 视频一结束就重新开始。
            preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
            language: 'zh-CN',
            aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
            fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
            sources: [
              {
                type: 'video/mp4',
                src: this.videoPath //url地址
              }
            ],
            poster: this.poster, //你的封面地址
            width: document.documentElement.clientWidth,
            notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
            controlBar: {
              timeDivider: true, //当前时间和持续时间的分隔符
              durationDisplay: true, //显示持续时间
              remainingTimeDisplay: false, //是否显示剩余时间功能
              fullscreenToggle: true //全屏按钮
            }
          }
      },
      //按钮播放
      openVideo() {
        this.$refs.videoPlayer.player.play()
        this.noOpen = false
      },
      //按钮暂停
      closeVideo() {
        this.noOpen = true
        this.$refs.videoPlayer.player.pause() // 暂停
      },
      // 播放回调
      onPlayerPlay($event) {
        this.noOpen = false
      },
      // 暂停回调
      onPlayerPause($event) {
        this.noOpen = true
      },
      // 视频播完回调
      onPlayerEnded($event) {
        this.noOpen = true
      },
    }
  }
</script>

<style scoped lang="scss">
  .video {
    width: 74%;
    height: 600px;
    // padding-bottom: 47%;
    background: #000000;
    position: relative;

    .video-player {
      width: 100%;
      height: 100%;
      position: absolute;
      object-fit: fill;

      ::v-deep .video-js.vjs-fluid {
        height: 100%;
        padding-top: 0;
      }

      ::v-deep .video-js {
        .vjs-poster {
          background-size: cover; //这个是让封面的背景图覆盖整个盒子
        }

        //这个是修改默认的按钮样式，一般默认在正中间，我项目需要放在左下角
        .vjs-big-play-button {
          height: 46px;
          width: 46px;
          bottom: 24px;
          left: 24px;
          top: auto;
          border: 1px solid #fff;
          border-radius: 50%;
          outline: none;
        }

        .vjs-play-control {
          outline: none;
        }

        .vjs-fullscreen-control {
          outline: none;
        }
      }
    }
  }
</style>
