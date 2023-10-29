Page({
  data: {
    url:null
  },
  async onLoad() {
    my.showLoading({
      content: '图片加载中...',
      delay: '100',
    });
    await this.initPic();
    my.hideLoading();
  },
  async upload(){
    var self  = this;
    const imgRes = await my.chooseImage();
    my.showLoading({
      content: '上传中...',
      delay: '100',
    });
    //删除当前图片
    try {
      await this.deleteCurrentPic();
    } catch (error) {
      console.log(error);
    }
   
    console.log("删除图片完成");
    const res    = await my.fncontext.uploadFile({
      //如果是覆盖的同一个图片，下载的时候有缓存，不会立即变化
      cloudPath: 'example'+Date.now()+'.png',
      filePath: imgRes.tempFilePaths[0]
    });


    console.log("更新数据库库 fileID="+res.fileID);
    await my.fncontext.callFunction({
       name:"pics",
       data:{
         action:"updatePic",
         fileID: res.fileID
       }
    });
    await this.initPic();
    my.hideLoading();
  },
  
  //删除掉当前的图片
  async deleteCurrentPic(){
     await my.fncontext.callFunction({
      name:"pics",
      data:{
        action: "deleteCurrentPic"
      }  
    });
  },

  async initPic(){
    var fileId;
    var url;
     try {
      ({result:{res:fileId,url}}  = await my.fncontext.callFunction({
        name:"pics",
        data:{
          action: "getPic"
        }  
      }));
     } catch (error) {
       console.log(error);
     }
     
     console.log(" downloadFile fileID= " + fileId);
     console.log(" downloadFile url= " + url);
    if(!fileId){
      this.setData({url: null});
      return;
    }
   
    this.setData({url:url});
  },

  /**
   * 支付宝端获取临时 URL
   */
  async getURL(){
    var fileId;
    var url;
     try {
      ({result:{res:fileId}}  = await my.fncontext.callFunction({
        name:"pics",
        data:{
          action: "getPic"
        }  
      }));
     } catch (error) {
       console.log(error);
     }

     
     const res = await  my.fncontext.getTempFileURL({
      fileList: [
        fileId
      ],
    });
     
     console.log(" url  = " + res);

  }

});
