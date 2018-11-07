// pages/word/word.js
var translate = require("../../resource/translate.js");
Page({

  cur_word: "",

  /**
   * 页面的初始数据
   */
  data: {
    volume_type: "off",
    is_word_querying: false,
    is_clear_all: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    try {
      const res = wx.getStorageInfoSync();
      this.setData({
        word_list: res.keys
      });
    } catch (e) {
      // Do something when catch error
    }
  },

  onReady: function() {
    this.audioCtx = wx.createAudioContext("word_sound");
    let list_height = wx.getSystemInfoSync().windowHeight - 130
    this.setData({
      list_height: list_height
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  go_back: function(e) {
    // 带参数返回上一页
    // let pages = getCurrentPages();
    // let prevPage = pages[pages.length - 2];
    // prevPage.setData({
    //   message: e.currentTarget.dataset.msg,
    // })
    wx.navigateBack({
      delta: 1,
    })
  },

  play_word_sound: function(e) {
    this.setData({
      volume_type: "up"
    });
    this.audioCtx.play();
  },

  word_sound_end: function(e) {
    this.setData({
      word_sound_url: "",
      volume_type: "off"
    });
  },

  go_to_source: function(e) {
    try {
      var value = wx.getStorageSync(this.cur_word);
      if (value) {
        wx.navigateTo({
          url: '/pages/video/video?video_title=' + value.title + '&video_filename=' + value.filename
        });
      }
    } catch (e) {
      // Do something when catch error
    }
  },

  show_explain: function() {
    this.cur_word = this.data.word_list[this.data.current_word_index];
    this.data.word_sound_url = "https://tts.yeshj.com/s/" + this.cur_word;
    var that = this;
    translate.request(this.cur_word, function(res) {
      that.data.query_word_result = res.data;
      that.setData({
        is_word_querying: true,
        query_word_result: res.data,
        word_sound_url: that.data.word_sound_url,
        current_word_index: that.data.current_word_index
      });
    });
  },

  show_click_explain: function(e) {
    this.data.current_word_index = e.currentTarget.dataset.wordidx;
    this.show_explain();
  },

  show_up_explain: function(e) {
    this.data.current_word_index -= 1;
    if (this.data.current_word_index < 0) {
      this.data.current_word_index = 0;
      return;
    }
    this.show_explain();
  },

  show_next_explain: function(e) {
    this.data.current_word_index += 1;
    if (this.data.current_word_index >= this.data.word_list.length) {
      this.data.current_word_index = this.data.word_list.length - 1;
      return;
    }
    this.show_explain();
  },

  close_explain: function(e) {
    this.setData({
      is_word_querying: false
    });
  },

  delete_word: function(e) {
    try {
      let word_index = e.currentTarget.dataset.wordidx;
      this.data.word_list.splice(word_index, 1);
      wx.removeStorageSync(e.currentTarget.dataset.word);
      this.setData({
        word_list: this.data.word_list
      });
    } catch (e) {
      // Do something when catch error
    }
  },

  clear_all: function(e) {
    this.setData({
      is_clear_all: true
    });


  },

  clear_all_no: function(e) {
    this.setData({
      is_clear_all: false
    });
  },

  clear_all_yes: function(e) {
    try {
      wx.clearStorageSync();
      this.setData({
        word_list: [],
        is_clear_all: false
      });
    } catch (e) {
      // Do something when catch error
    }
  }
})