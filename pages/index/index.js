//index.js
var video_list = require("../../resource/video_list.js");
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    navData: [{
        text: '时间管理'
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
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
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