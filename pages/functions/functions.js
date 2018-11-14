// pages/functions/functions.js
//获取应用实例
const app = getApp()

Page({

  /**
   * Page initial data
   */
  data: {
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var that = this;
    wx.getSetting({
      success: function (res) {
        if (app.globalData.is_pos_share == "off") {
          that.data.is_pos_share = false;
        } else {
          that.data.is_pos_share = true;
        }
        that.setData({
          is_pos_share: that.data.is_pos_share,
          is_auth_location: res.authSetting['scope.userLocation']
        });
      }
    });
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {
  },

  set_share_pos: function(e) {
    if (app.globalData.is_pos_share == "off") {
      app.globalData.is_pos_share = "on";
      this.data.is_pos_share = true;
    } else {
      app.globalData.is_pos_share = "off";
      this.data.is_pos_share = false;
    }

    var that = this;
    wx.request({
      url: 'https://iperson.top/wx_login.php',
      data: {
        req_type: "share_position",
        openid: app.globalData.openid,
        is_pos_share: app.globalData.is_pos_share
      },
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        // console.log(res);
        console.log('服务器请求成功!');
      },
      fail: function () {
        console.log('服务器请求失败!');
      },
      complete: function () {
        that.setData({
          is_pos_share: that.data.is_pos_share
        });
      }
    })
  },

  open_word: function() {
    wx.navigateTo({
      url: '/pages/word/word'
    });
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