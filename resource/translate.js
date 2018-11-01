var config = require('./config.js')
var test = "https://fanyi.youdao.com/openapi.do?keyfrom=keynes&key=1134658851&type=data&doctype=json&version=1.1&q=test";
function request(word, cb) {
  wx.request({
    url: 'https://fanyi.youdao.com/openapi.do?keyfrom=' + config.keyfrom + '&key=' + config.APIKey + '&type=data&doctype=json&version=1.1&q=' + word,
    success: function (res) {
      cb(res);
    }
  });
}

module.exports = {
  request: request
}
