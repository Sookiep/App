Page({
  data: {
    key:"",
    value:"",
    skey:"",
    svalue:""
  },
  onLoad() {},
  bindInput(e){
    var data = {};
        data[e.target.dataset.name] = e.detail.value;
        console.log(data);
    this.setData(data);
  },
  async setValue(){
   await  my.fncontext.callFunction({
       name:"redis",
       data:{
         action:"set",
         key:this.data.key,
         value:this.data.value
       }
    });
  },
  async getValue(){
    var value = await  my.fncontext.callFunction({
        name:"redis",
        data:{
          action:"get",
          key:this.data.skey,
        }
     });
     console.log(value);
     this.setData({
       svalue:value.result.value
     });
   }
});
