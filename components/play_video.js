// pages/components/play_video.js
var util = require("../utils/util.js");
var translate = require("../resource/translate.js");

Component({
  last_play_time: 0,

  ready: function() {
    this.subtitles_file = require("../resource/" + this.properties.videoSrc + ".js");
    this.VideoContext = wx.createVideoContext("current_video", this);
    this.audioCtx = wx.createAudioContext("word_sound", this);
    this.video_height = wx.getSystemInfoSync().windowWidth / 16 * 9;
    this.subtitles_height = wx.getSystemInfoSync().windowHeight - 76 - 30 - this.video_height;
    this.subtitle_eng_content = [];
    for (let i = 0; i < this.subtitles_file.subtitles.length; i++) {
      this.subtitle_eng_content.push(this.subtitles_file.subtitles[i].eng.split(" "));
    }
    this.data.video_url = "https://iperson.top/function/english/video/ted/" + this.properties.videoSrc + ".mp4";
    this.setData({
      video_height: this.video_height,
      subtitles_height: this.subtitles_height,
      subtitle_content: this.subtitles_file.subtitles,
      subtitle_eng_content: this.subtitle_eng_content,
      video_url: this.data.video_url,
      subtitle_end_index: this.subtitle_eng_content.length - 1
    });

    for (let i = 0; i < this.subtitles_file.subtitles.length; i++) {
      this.set_sentence_view_pos_arr_chn(i);
    }

    this.data.subtitle_translate_hide = true;

    this.setData({
      subtitle_translate_hide: this.data.subtitle_translate_hide
    });

    for (let i = 0; i < this.subtitles_file.subtitles.length; i++) {
      this.set_sentence_view_pos_arr(i);
    }
  },

  properties: {
    videoTitle: {
      type: String,
      value: "未知"
    },
    videoSrc: {
      type: String,
      value: ""
    }
  },

  /**
   * Component initial data
   */
  data: {
    view_model: "阅读模式",
    play_status: "pause",
    explain_panel_hidden: true,
    subtitle_translate_hide: false,
    explain_title_color: "orange",
    current_index: 0,
    subtitle_scroll_top: 0,
    sentence_view_pos_arr: [],
    sentence_view_pos_arr_chn: []
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

    set_sentence_view_pos_arr: function(idx) {
      var that = this;
      let id_mark = "#view" + idx;
      const query = wx.createSelectorQuery().in(this);
      query.select(id_mark).boundingClientRect(function(res) {
        that.data.sentence_view_pos_arr.push(res.top);
      }).exec()
    },

    set_sentence_view_pos_arr_chn: function(idx) {
      var that = this;
      let id_mark = "#view" + idx;
      const query = wx.createSelectorQuery().in(this);
      query.select(id_mark).boundingClientRect(function(res) {
        that.data.sentence_view_pos_arr_chn.push(res.top);
      }).exec()
    },

    video_play_event: function(e) {
      this.data.play_status = "play";
      this.setData({
        play_status: this.data.play_status,
        subtitle_scroll_top: 0
      });
    },

    video_pause_event: function(e) {
      this.data.play_status = "pause";
      let current_sentence_scroll_height = this.data.sentence_view_pos_arr[this.data.current_index] - this.data.sentence_view_pos_arr[0];
      this.setData({
        play_status: this.data.play_status,
        subtitle_scroll_top: current_sentence_scroll_height
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
      this.data.current_index = sentence_index;
      this.VideoContext.seek(this.subtitles_file.subtitles[sentence_index].start);
      this.VideoContext.play();
      this.data.play_status = "play";
      this.setData({
        play_status: this.data.play_status,
        current_index: this.data.current_index
      });
    },

    next_sentence: function(e) {
      this.data.current_index = e.currentTarget.dataset["idx"] + 1;
      this.VideoContext.seek(this.subtitles_file.subtitles[this.data.current_index].start);
      this.VideoContext.play();
      this.data.play_status = "play";
      this.setData({
        play_status: this.data.play_status,
        current_index: this.data.current_index
      });
    },

    prev_sentence: function(e) {
      this.data.current_index = e.currentTarget.dataset["idx"] - 1;
      this.VideoContext.seek(this.subtitles_file.subtitles[this.data.current_index].start);
      this.VideoContext.play();
      this.data.play_status = "play";
      this.setData({
        play_status: this.data.play_status,
        current_index: this.data.current_index
      });
    },

    play_goback: function(e) {
      var set_time = this.last_play_time - 5;
      if (set_time > 0) {
        this.last_play_time = set_time;
        this.reset_current_index(set_time);
        this.VideoContext.seek(set_time);
        this.VideoContext.play();
        this.data.play_status = "play";
      }
    },

    play_forward: function(e) {
      var set_time = this.last_play_time + 5;
      if (set_time > 0) {
        this.last_play_time = set_time;
        this.reset_current_index(set_time);
        this.VideoContext.seek(set_time);
        this.VideoContext.play();
        this.data.play_status = "play";
      }
    },

    query_eng_word: function(e) {
      wx.showToast({
        title: '查词中',
        icon: 'success',
        image: "/image/query.png",
        duration: 1000,
        mask: true
      })
      var idx1 = e.currentTarget.dataset.idxx;
      var idx2 = e.currentTarget.dataset.idxy;
      this.data.select_word_pos = [idx1, idx2];
      var query_original_word = e.currentTarget.dataset.word; // 该变量为原查询单词（包括符号，如：abc. a's等）
      this.data.query_word = this.get_char_from_string(query_original_word);
      this.data.word_sound_url = "https://tts.yeshj.com/s/" + this.data.query_word;
      var that = this;
      translate.request(this.data.query_word, function(res) {
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
      var that = this;
      wx.createSelectorQuery().in(this).select("#subtitle-view").scrollOffset(function(res) {
        // console.log(res.scrollTop); // 节点的竖直滚动位置
        var temp_arr_before = [];
        var temp_arr_after = [];
        var cur_section_index = 0;
        if (that.data.subtitle_translate_hide) {
          temp_arr_before = that.data.sentence_view_pos_arr;
          temp_arr_after = that.data.sentence_view_pos_arr_chn;
          that.data.subtitle_translate_hide = false;
        } else {
          temp_arr_before = that.data.sentence_view_pos_arr_chn;
          temp_arr_after = that.data.sentence_view_pos_arr;
          that.data.subtitle_translate_hide = true;
        }
        for (let i = 0; i < temp_arr_before.length; i++) {
          if (res.scrollTop < temp_arr_before[i + 1] - temp_arr_before[0]) {
            cur_section_index = i;
            break;
          }
        }

        console.log(cur_section_index);

        var scrollbar_offset_top = temp_arr_after[cur_section_index] - temp_arr_after[0];

        that.setData({
          subtitle_translate_hide: that.data.subtitle_translate_hide,
          subtitle_scroll_top: scrollbar_offset_top
        });
      }).exec();
    },

    word_sound_start: function(e) {
      this.data.explain_title_color = "#fff";
      this.setData({
        explain_title_color: this.data.explain_title_color
      });
    },

    word_sound_end: function(e) {
      this.data.explain_title_color = "orange";
      this.setData({
        explain_title_color: this.data.explain_title_color
      });
    },

    video_listen: function(e) {
      // 发生滚动条拉动（根据时间差来判断）
      if (this.last_play_time > e.detail.currentTime || (e.detail.currentTime - this.last_play_time) > 3) {
        this.reset_current_index(e.detail.currentTime);
      }
      this.last_play_time = e.detail.currentTime;
      if (this.data.current_index + 1 >= this.subtitles_file.subtitles.length) {
        return;
      }
      if (e.detail.currentTime > this.data.subtitle_content[this.data.current_index + 1].start) {
        this.data.current_index++;
      }
      this.setData({
        current_index: this.data.current_index
      });
    },

    reset_current_index: function(cur_time) {
      if (cur_time <= this.data.subtitle_content[0].start) {
        this.data.current_index = 0;
        return;
      }
      for (let i = this.data.subtitle_content.length - 1; i >= 0; i--) {
        if (cur_time > this.data.subtitle_content[i].start) {
          this.data.current_index = i;
          return;
        }
      }
    },

    add_word: function(e) {
      var today = util.formatYMD(new Date());
      wx.showToast({
        title: '已添加',
        icon: 'success',
        image: "/image/book.png",
        duration: 500
      })
      wx.setStorage({
        key: e.currentTarget.dataset.word,
        data: {
          date: today,
          title: this.properties.videoTitle,
          filename: this.properties.videoSrc
        }
      })
    },

    open_word_book: function(e) {
      wx.navigateTo({
        url: '/pages/word/word'
      });
    }
  }
})