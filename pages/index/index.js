//index.js
var video_list = require("../../resource/video_list.js");
//获取应用实例
const app = getApp()

Page({
  data: {
    login_status: app.globalData.login_status,
    navData: [{
      text: '工作生活'
      },
      {
        text: '高端知识'
      },
      {
        text: '教育理念'
      }
    ],
    currentTab: 0,
    navScrollLeft: 0,
    videos: video_list.videos
  },

  onReady: function() {
    this.video_list_height = wx.getSystemInfoSync().windowHeight - 70 - 30;
    this.data.windowWidth = wx.getSystemInfoSync().windowWidth;
    this.setData({
      video_list_height: this.video_list_height
    });
  },

  onLoad: function() {
    if (app.globalData.login_status != "logined") {

      app.set_login_status = res => {
        this.setData({
          login_status: app.globalData.login_status
        })
      }

      app.update_login_status = res => {
        this.setData({
          login_status: app.globalData.login_status
        })
      }
    }
  },

  bindGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      app.globalData.login_status = "logining";
      this.setData({
        login_status: app.globalData.login_status
      });
      app.globalData.userInfo = e.detail.userInfo;
      // console.log(app.globalData.userInfo);
      if (app.userInfoReadyCallback) {
        app.userInfoReadyCallback()
      }
    }
  },

  switchNav(event) {
    var cur = event.currentTarget.dataset.current;
    //每个tab选项宽度占1/5
    var singleNavWidth = this.data.windowWidth / 5;
    //tab选项居中                            
    this.setData({
      navScrollLeft: (cur - 2) * singleNavWidth
    })
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },

  open_setting: function(e) {
    wx.navigateTo({
      url: '/pages/functions/functions'
    });
  },

  switchTab(event) {
    var cur = event.detail.current;
    var singleNavWidth = this.data.windowWidth / 5;
    this.setData({
      currentTab: cur,
      navScrollLeft: (cur - 2) * singleNavWidth
    });
  },

  play_video: function(e) {
    // wx.getNetworkType({
    //   success(res) {
    //     const networkType = res.networkType;
    //     console.log(networkType);
    //     if (networkType == "wifi") {
    //       wx.showModal({
    //         title: '提示',
    //         content: '正在使用流量，是否继续播放！',
    //         success(res) {
    //           if (res.confirm) {
    //             console.log('用户点击确定')
    //           } else if (res.cancel) {
    //             console.log('用户点击取消')
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
    wx.navigateTo({
      url: '/pages/video/video?video_title=' + e.currentTarget.dataset.title + '&video_filename=' + e.currentTarget.dataset.filename
    });
  }
})