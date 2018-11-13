// pages/functions/functions.js
//获取应用实例
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
    userInfo: {},
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {

  },

  open_word: function() {
    wx.navigateTo({
      url: '/pages/word/word'
    });
  }
})