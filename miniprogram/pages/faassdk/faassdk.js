const cloud = require('@alipay/faas-web-sdk');
Page({
  data: {
    data:null
  },
  onLoad() {
  },
  /**
   * 使用 FaaS SDK 可支持多端调用，在支付宝端、Web端、其它小程序端都可以使用
   */
  async callFunction(){
    var self = this;
    const sdk = new cloud.Cloud({
      //在环境概览中获取
      endpoint: 'https://env-00jx467y0ti7.api-hz.cloudbasefunction.cn',
       //在环境概览中获取 AK
      secretId: 'ZQueN2ypZNgHoN8D',
      //在环境概览中获取 SK
      secretKey: 'xOmTfuUZTmtHmrX1',
      //填写自己的APPID 
      appId: '2021003146641256',
      //填写自己的环境ID
      envId: 'env-00jx467y0ti7',
    });
    try {
      const res = await sdk.callFunction({
        name: 'helloworld',
      });

      console.log(res);
      self.setData({
           data:res.result.message
      })
      console.log('调用结果', res);
    } catch(e) {
      console.error('调用失败', e);
    }
  }


});
