Page({
  data: {
    data:{}
  },
  async onLoad() {
    this.getOpenID();
  },
  async getOpenID(){
    my.showLoading({
      content: '查询中...',
      delay: '100',
    });
    var  res =  await my.fncontext.callFunction(
       {name:"getOpenID"}
    );
    console.log(res);
    this.setData({
      data:res.result
    })
    my.hideLoading();
  }
});
