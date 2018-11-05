// pages/video/video.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: app.globalData.userInfo
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      video_title: options.video_title,
      video_filename: options.video_filename
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
  }
})