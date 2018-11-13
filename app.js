//app.js
App({
  onLaunch: function() {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
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
              console.log(that.globalData.userInfo);
              wx.request({
                url: 'https://iperson.top/wx_login.php',
                data: {
                  req_type: "login",
                  code: that.globalData.code,
                  nickName: that.globalData.userInfo.nickName,
                  avatarUrl: that.globalData.userInfo.avatarUrl,
                  gender: that.globalData.userInfo.gender,
                  latitude: res.latitude,
                  longitude: res.longitude
                },
                method: 'POST',
                header: {
                  "content-type": "application/x-www-form-urlencoded"
                },
                success: function(res) {
                  that.globalData.openid = res.data.openid;
                  console.log(that.globalData.openid);
                },
                fail: function() {
                  that.globalData.openid = "_error";
                  console.log('服务器请求失败!');
                },
              })
            }
          });
        } else {
          that.globalData.openid = "_error";
          console.log('获取用户信息失败!' + res.errMsg)
        }
      }
    });
  },

  globalData: {
    userInfo: null
  }
})