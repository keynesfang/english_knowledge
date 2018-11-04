// pages/word/word.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      const res = wx.getStorageInfoSync();
      console.log(res);
      this.setData({
        word_list: res.keys
      });
    } catch (e) {
      // Do something when catch error
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  go_back: function (e) {
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