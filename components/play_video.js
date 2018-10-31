// pages/components/play_video.js
var subtitles_file = require("../resource/subtitles.js");

Component({
  VideoContext: "",

  ready: function () {
    console.log(wx.getSystemInfoSync().windowHeight);
    this.VideoContext = wx.createVideoContext("current_video", this);
   },
  properties: {

  },

  /**
   * Component initial data
   */
  data: {
    view_model: "阅读模式",
    play_status: "play",
    video_src: "https://iperson.top/function/english/video/ted/How_to_gain_control_of_your_free_time.mp4",
    subtitle_content: subtitles_file.subtitles
  },

  /**
   * Component methods
   */
  methods: {
    switch_view_model: function(e) {
      if (this.data.view_model == "阅读模式") {
        this.data.view_model = "视频模式";
        this.data.play_status = "pause";
      } else {
        this.data.view_model = "阅读模式";
        this.data.play_status = "pause";
      }
      this.setData({
        view_model: this.data.view_model,
        play_status: this.data.play_status
      });
    },

    video_play_control: function(e) {
      if (this.data.play_status == "pause") {
        this.VideoContext.play();
        this.data.play_status = "play";
      } else {
        this.VideoContext.pause();
        this.data.play_status = "pause";
      }
      this.setData({
        play_status: this.data.play_status
      });
    }
  }
})
