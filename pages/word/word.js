// pages/word/word.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    volume_type: "off"
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
    this.data.word_sound_url = "https://tts.yeshj.com/s/" + e.currentTarget.dataset.word;
    this.data.click_word_index = e.currentTarget.dataset.wordidx;
    this.setData({
      word_sound_url: this.data.word_sound_url,
      click_word_index: this.data.click_word_index
    });
    this.audioCtx.play();
  },

  word_sound_end: function(e) {
    this.setData({
      word_sound_url: "",
      click_word_index: -1
    });
  },

  go_to_source: function(e) {
    try {
      var value = wx.getStorageSync(e.currentTarget.dataset.word)
      if (value) {
        wx.navigateTo({
          url: '/pages/video/video?video_title=' + value.title + '&video_filename=' + value.filename
        });
      }
    } catch (e) {
      // Do something when catch error
    }
  },

  delete_word: function(e) {
    try {
      wx.removeStorageSync(e.currentTarget.dataset.word)
    } catch (e) {
      // Do something when catch error
    }
  }
})