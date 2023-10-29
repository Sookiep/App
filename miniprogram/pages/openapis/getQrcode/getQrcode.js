Page({
  data:{
    data:null
  },
  getAuthCode() {
    var self = this;
    my.showLoading({
      content: '查询中...',
      delay: '100',
    });
    my.fncontext.callFunction({
      name:'openapis',
      data:{
        action:"getQrCode"
      },
      success:function(res){       
         my.hideLoading();
         console.log(res);
         self.setData({
           data:res.result
         });
      },
      fail:function(erro){
        my.hideLoading();
        console.log(erro);
        self.setData({
          data:null
        });
      }
    });
  }
})