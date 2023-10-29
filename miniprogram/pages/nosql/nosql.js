Page({
  data: {
    name:"",
    users:[]
  },
  async onLoad() {
    await this.getAllUsers();
  },
  bindInput(e){
    this.setData({
      name:e.detail.value
   })
  },
  async addUser(){
    if(!this.data.name){
      my.showToast({
        content:'输入合法用户名',
        duration:1000
      });
      return;
    }
    my.showLoading({
      content: '请等待...',
      delay: '10',
    });
    try {
      await my.fncontext.callFunction({
        name:"nosql",
        data:{
            action:"addUser",
            name:this.data.name
        }
      });
    } catch (error) {
       console.log(error);
    }
    await this.getAllUsers();
    my.hideLoading();
  },
  async getAllUsers(){
    var res
    try {
      res = await my.fncontext.callFunction({
        name:"nosql",
        data:{
            action:"getAllUsers"
        }
      });
    } catch (error) {
      console.log("查询用户异常");
      console.log(error);
    } 
    if(!res||!res.result.data){
      return;
    }
    console.log(res.result.data);
    this.setData({
      users:res.result.data
    })
  },
  async deleteUser(e){
    my.showLoading({
      content: '请等待...',
      delay: '10',
    });
    var res
    try {
        res = await my.fncontext.callFunction({
        name:"nosql",
        data:{
            action:"deleteUser",
            id: e.target.dataset.id
        }
      });
    } catch (error) {
      console.log("删除用户异常");
      console.log(error)
    }
    
   console.log("删除用户成功！")
   await this.getAllUsers();
   my.hideLoading();
  }

});
