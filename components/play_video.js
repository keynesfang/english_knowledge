// pages/components/play_video.js
var subtitles_file = require("../resource/subtitles.js");
var translate = require("../resource/translate.js");

Component({
  ready: function() {
    this.VideoContext = wx.createVideoContext("current_video", this);
    this.audioCtx = wx.createAudioContext("word_sound", this);
    this.video_height = wx.getSystemInfoSync().windowWidth / 16 * 9;
    this.subtitles_height = wx.getSystemInfoSync().windowHeight - 76 - 30 - this.video_height;
    this.subtitle_eng_content = [];
    for (let i = 0; i < subtitles_file.subtitles.length; i++) {
      this.subtitle_eng_content.push(subtitles_file.subtitles[i].eng.split(" "));
    }
    this.setData({
      video_height: this.video_height,
      subtitles_height: this.subtitles_height,
      subtitle_content: subtitles_file.subtitles,
      subtitle_eng_content: this.subtitle_eng_content
    });
  },

  properties: {
    videoTitle: {
      type: String, 
      value: "未知"
    }
  },

  /**
   * Component initial data
   */
  data: {
    view_model: "阅读模式",
    play_status: "pause",
    video_src: "https://iperson.top/function/english/video/ted/How_to_gain_control_of_your_free_time.mp4",
    explain_panel_hidden: true,
    subtitle_translate_hide: true,
    explain_title_color: "orange"
  },

  /**
   * Component methods
   */
  methods: {
    switch_view_model: function(e) {
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
    },

    play_sentence: function(e) {
      var sentence_index = e.currentTarget.dataset["idx"];
      this.VideoContext.seek(subtitles_file.subtitles[sentence_index].start);
      this.VideoContext.play();
      this.data.play_status = "play";
      this.setData({
        play_status: this.data.play_status
      });
    },

    query_eng_word: function(e) {
      var idx1 = e.currentTarget.dataset.idxx;
      var idx2 = e.currentTarget.dataset.idxy;
      this.data.select_word_pos = [idx1, idx2];
      var query_original_word = e.currentTarget.dataset.word; // 该变量为原查询单词（包括符号，如：abc. a's等）
      this.data.query_word = this.get_char_from_string(query_original_word);
      this.data.word_sound_url = "https://tts.yeshj.com/s/" + this.data.query_word;
      var that = this;
      translate.request(this.data.query_word, function(res) {
        that.data.query_word_result = res.data;
        console.log(res.data);
        that.setData({
          query_word_result: res.data,
          explain_panel_hidden: false,
          word_sound_url: that.data.word_sound_url
        });
      });
    },

    play_word_sound: function(e) {
      this.audioCtx.play();
    },

    get_char_from_string: function(str) {
      var word = "";
      var out_char = "'";
      var out_char_pos = str.indexOf(out_char)
      if (out_char_pos > 0) {
        str = str.substring(0, out_char_pos);
      }
      var reg = new RegExp(/([^a-zA-Z-]+)/g);
      word = str.replace(reg, "");
      return word;
    },

    close_panel: function(e) {
      this.setData({
        explain_panel_hidden: true
      });
    },

    switch_subtitle_translate: function(e) {
      if (this.data.subtitle_translate_hide) {
        this.data.subtitle_translate_hide = false;
      } else {
        this.data.subtitle_translate_hide = true;
      }
      this.setData({
        subtitle_translate_hide: this.data.subtitle_translate_hide
      });
    },

    word_wound_start: function(e) {
      this.data.explain_title_color = "#fff";
      this.setData({
        explain_title_color: this.data.explain_title_color
      });
    },

    word_wound_end: function(e) {
      this.data.explain_title_color = "orange";
      this.setData({
        explain_title_color: this.data.explain_title_color
      });
    }
  }
})