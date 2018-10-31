// pages/components/play_video.js
var subtitles_file = require("../resource/subtitles.js");

Component({
  VideoContext: "",
  video_height: 0,
  subtitles_height: 0,

  ready: function () {
    this.VideoContext = wx.createVideoContext("current_video", this);
    this.video_height = wx.getSystemInfoSync().windowWidth / 16 * 9;
    console.log(this.video_height);
    this.subtitles_height = wx.getSystemInfoSync().windowHeight - 70 - 30 - this.video_height;
    this.setData({
      video_height: video_height,
      subtitles_height: subtitles_height
    });
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
    switch_view_model: function (e) {
      if (this.data.view_model == "阅读模式") {
        this.data.view_model = "视频模式";
        var temp_subtitles_height = this.subtitles_height + this.video_height;
      } else {
        this.data.view_model = "阅读模式";
        this.data.play_status = "pause";
        var temp_subtitles_height = this.subtitles_height;
      }
      this.setData({
        view_model: this.data.view_model,
        play_status: this.data.play_status,
        subtitles_height: temp_subtitles_height
      });
    },

    video_play_control: function (e) {
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
