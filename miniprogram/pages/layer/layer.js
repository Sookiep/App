Page({
  data: {
    data:null,
    a:null,
    b:null
  },
  onLoad() {

  },
  bindInput(e){
    var value ={};
        value[e.target.dataset.vname]= parseInt(e.detail.value);
    console.log(value);
    this.setData(value);
  },
  useLayer(){
    var self  = this;
    my.fncontext.callFunction({
      name:"useLayer",
      data:{
        a:this.data.a,
        b:this.data.b
      },
      success:function(res){
        console.log(res);
         self.setData({
           data:res.result.res
         })
      },

      fail:function(err){
        console.log(err);
      }

    });
  }


});
