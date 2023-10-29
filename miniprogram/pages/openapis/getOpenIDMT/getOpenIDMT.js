Page({
  data:{
    data:null
  },
  getAuthCode() {
    var self = this;
    my.getAuthCode({
      scopes: 'auth_user',
      success: res => {
        const authCode = res.authCode;
        console.log(authCode);
        my.fncontext.callFunction({
          name:'getOpenIDMT',
          data:{
            code: authCode
          },
          success:function(res){       
             console.log(res);
             self.setData({
               data:res.result
             });
          },
          fail:function(erro){
            //console.log(erro);
            self.setData({
              data:null
            });
          }
        });
        
      },
      fail: err => {
        console.log('my.getAuthCode 调用失败', err)
      }
    });
  }
})