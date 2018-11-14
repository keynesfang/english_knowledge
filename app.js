//app.js
App({
  onLaunch: function() {
    this.globalData.login_status = "unlogin";
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          this.globalData.login_status = "logining";
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback()
              }
            }
          })
        }
      }
    })
  },

  userInfoReadyCallback: function() {
    // 登录远程服务器
    var that = this;
    wx.login({
      success: function(res) {
        if (res.code) {
          //存在code
          that.globalData.code = res.code;
          wx.getLocation({
            type: 'wgs84',
            success(res) {
              that.globalData.userInfo.latitude = res.latitude;
              that.globalData.userInfo.longitude = res.longitude;
              // console.log(that.globalData.userInfo);
              that.service_login();
            },
            fail() {
              that.globalData.userInfo.latitude = 0;
              that.globalData.userInfo.longitude = 0;
              // console.log(that.globalData.userInfo);
              that.service_login();
            }
          });
        } else {
          that.globalData.openid = "_error";
          console.log('获取用户信息失败!' + res.errMsg)
        }
      }
    });
  },

  service_login: function() {
    var that = this;
    wx.request({
      url: 'https://iperson.top/wx_login.php',
      data: {
        req_type: "login",
        code: this.globalData.code,
        nickName: this.globalData.userInfo.nickName,
        avatarUrl: this.globalData.userInfo.avatarUrl,
        gender: this.globalData.userInfo.gender,
        latitude: this.globalData.userInfo.latitude,
        longitude: this.globalData.userInfo.latitude
      },
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        that.globalData.openid = res.data.openid;
        that.globalData.is_pos_share = res.data.is_pos_share;
        that.globalData.login_status = "logined";
        if (that.update_login_status) {
          that.update_login_status();
        }
        console.log(res);
      },
      fail: function() {
        that.globalData.openid = "_error";
        console.log('服务器请求失败!');
      }
    })
  },

  globalData: {
    userInfo: null
  }
})

// "tabBar": {
//   "list": [
//     {
//       "pagePath": "pages/index/index",
//       "selectedIconPath": "/image/main_active.png",
//       "iconPath": "/image/main.png",
//       "selectedColor": "#1296db",
//       "text": "学习"
//     },
//     {
//       "pagePath": "pages/functions/functions",
//       "selectedIconPath": "/image/sub_active.png",
//       "iconPath": "/image/sub.png",
//       "selectedColor": "#1296db",
//       "text": "周边"
//     }
//   ]
// }