//index.js
var article_list = require("../../resources/article_list.js");
var translate = require("../../resources/translate.js");
var touchDot = 0;// 触摸时的原点
var distance = ""; // 记录滑动的方向 负数为向左划 正数为向右划

Page({
  data: {
  },
  onLoad: function () {
    var that = this;
    wx.getNetworkType({
      success: function (res) {
        that.setData({
          net_type: res.networkType
        });
      }
    });
    wx.onNetworkStatusChange(function (res) {
      that.setData({
        net_type: res.networkType
      });
    });
    this.setData({
      article: article_list.get_current_article_list()
    });
  }
});
