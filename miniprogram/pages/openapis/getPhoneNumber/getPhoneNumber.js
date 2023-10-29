Page({
  getPhoneNumber() {
    var self  = this;
    my.getPhoneNumber({
      success: (res) => {
        let encryptedData = res.response;
        console.log(encryptedData);
        my.fncontext.callFunction({
          name:'getPhoneNumber',
          data:{
            crypted: encryptedData
          },
          success:function(res){       
                console.log(res);
          },
          fail:function(erro){
            console.log(erro);
          }
        });
      },
      fail: (res) => {
          console.log("获取失败",res);
      },
    });
  }
})