import { IMAGE_TECHNOLOGY } from '../../common/constant/ocrtype';

Page({
  data: {
    IMAGE_TECHNOLOGY: IMAGE_TECHNOLOGY,
    type: '',
    pageImgUrl: '',
    resultData: {},
    isScanVisible: true,
    params: {
      method: 'anttech.ai.cv.ua.identify',
      app_id: '2021004106680316',
      charset: 'utf-8',
      version: '1.0',
      sign_type: 'RSA2',
      // timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
    },
    biz_content: {},
    sign: {},
    // 识别接口，params中需要传"mask": "Y"的类型，即只展示识别结果对比图
    needMaskType: ['idCardSecurity'],
    // 识别接口，params中需要传"sr_scale": "1"的类型，即清晰度识别
    needSrScaleType: ['restoreClarity'],
    ocrItem: {},
    showList: [],
    style: ''
  },

  handleBack() {
    my.switchTab({ url: `/pages/index/index` });
  },

  onLoad(query) {
    const { type } = query;
    // 找到ocrtype.js中对应类型项
    const ocrList = [];
    this.data.IMAGE_TECHNOLOGY.map(item => item.list).forEach(item => {
      item.forEach(item1 => ocrList.push(item1));
    })
    const ocrItem = ocrList.filter(item => item.value === type)[0];
    this.setData({
      isScanVisible: true,
      ocrItem: ocrItem,
      type: type, // OCR类型
    });

    this.OCRAnalyze({
      imageUrl: ocrItem.demoImgUrl
    });
  },

  onReady() {
    const { system, screenHeight, screenWidth, safeArea: { bottom } } = my.getSystemInfoSync();
    const isIPhoneX = /iphone\sx/i.test(system) || (screenHeight / screenWidth > 1.9);
    const paddingBottom = isIPhoneX ? Math.max(screenHeight - bottom, 0) : 0;
    this.setData({
      style: `height: ${paddingBottom}px;`,
    });
  },

  // 调用摄像头
  handleTakeCamera(e) {
    my.chooseImage({
      count: 1,
      success: res => {
        my.call('uploadImage', {
          data: res.apFilePaths[0], // base64编码过的图片字节流 或 图片的文件URL“file://xxxx”
          dataType: 'fileURL', // 指定上传时使用的是字节流还是绝对物理路径，'dataURL'-字节流，‘fileURL'-文件URL，默认为'dataURL'
          compress: 2, // 可选，默认为4。 0-低质量，1-中质量，2-高质量，3-不压缩，4-根据网络情况自动选择
          business: "multiMedia", // 可选， 默认为“NebulaBiz”
          publicDomain: true  // uploadImage属与jsapi，小程序中调用时使用my.call("uplaodImage")
        }, result => {
          console.log('takecamera_result=', result);
          if (!result || !result.multimediaID) {
            console.log('camera一次error')
            // my.reLaunch({ url: '/pages/result/result?source=error' });
            return;
          }
          this.setData({
            pageImgUrl: result.publicUrl
          })
          this.OCRAnalyze({
            imageUrl: result.publicUrl
            // imageUrl: 'https://cv-oss.oss-cn-beijing.aliyuncs.com/cv-demo/portal/%E9%80%9A%E7%94%A8%E6%96%87%E5%AD%97/1.png'
          });
          this.setData({ isScanVisible: true });
        });
      },
    });
  },

  // 身份证识别，中文展示对应接口value值
  getIdCardShowList(resultData) {
    const resList = [
      {
        name: '姓名',
        content: resultData.name
      },
      {
        name: '性别',
        content: resultData.sex
      },
      {
        name: '民族',
        content: resultData.nationality
      },
      {
        name: '出生日期',
        content: resultData.birth
      },
      {
        name: '住址',
        content: resultData.address
      },
      {
        name: '公民身份号码',
        content: resultData.num
      },
    ]
    // 是身份证反面
    resultData.issue && resList.push({
      name: '签发机关',
      content: resultData.issue
    })
    resultData.start_date && resList.push({
      name: '有效期限',
      content: `${resultData.start_date} - ${resultData.end_date}`
    })
    this.setData({
      showList: [...resList]
    })
  },

  // 营业执照、菜单识别
  getBusiLicenseShowList(resultData) {
    const keys = Object.keys(resultData);
    let resList = [];
    for (let i in keys) {
      const valueType = typeof resultData[keys[i]];
      resList.push(
        {
          name: keys[i],
          content: valueType === 'object' ? JSON.stringify(resultData[keys[i]]) : resultData[keys[i]]
        }
      )
      if (keys[i] === 'structure_data' && this.data.type === 'menuRecognition') {
        // 菜单识别，structure_data字段需要再分解
        resultData[keys[i]].forEach(item => {
          resList.push({
            name: Object.keys(item)[0],
            content: Object.values(item)[0] ? JSON.stringify(Object.values(item)[0]) : ''
          });
        })
        resList = resList.filter(item => item.name !== 'structure_data')
      }
    }
    this.setData({
      showList: [...resList]
    })
  },

  // 垃圾分类，处理接口数据展示
  getRubbishShowList(resultData) {
    console.log("resultData", resultData.object[0]);
    const resList = [
      {
        name: '物品名称',
        content: resultData.object[0].rubbish
      },
      {
        name: '垃圾分类',
        content: resultData.object[0].category
      },
    ]
    this.setData({
      showList: [...resList]
    })
  },

  // 预览图片
  previewImg(e) {
    const { imgSrc } = e.currentTarget.dataset;
    my.previewImage({
      urls: [imgSrc]
    });
  },

  // 不同类型对应展示的接口字段
  showCorrespondField(resultData) {
    switch (this.data.type) {
      case "commonOcr":
        // 通用文字
        return resultData.result;
      // 身份证识别
      case "idCard":
        this.getIdCardShowList(resultData);
        return resultData;
      // 身份证防伪识别、还原清晰度
      case 'idCardSecurity':
      case 'restoreClarity':
        return resultData;
      // 垃圾分类
      case 'refuseClassification':
        this.getRubbishShowList(resultData);
        return resultData.object[0];
      // 营业执照、菜单识别
      case 'businessLicense':
      case 'menuRecognition':
      case "bankCard":
        this.getBusiLicenseShowList(resultData);
        return resultData;
      default:
        break;
    }
  },

  // OCR识别接口
  async OCRAnalyze(aParams) {
    await my.fncontext.init(); 
    const ocr    =  await my.fncontext.callFunction({
      name:"saasUseAIOCR",
      data:{
        imageUrl:aParams.imageUrl,
        mask: this.data.needMaskType.includes(this.data.type) ? 'Y' : '',
        serviceCode: this.data.ocrItem.serviceCode,
        uri: this.data.ocrItem.uri,
        attributes: this.data.ocrItem.attributes
      }
    }
    )
    const resultObject = ocr.result;
    if (resultObject.msg === 'Success') {
      const resultData = JSON.parse(resultObject.resultStr);
      this.setData({ infoList: this.showCorrespondField(resultData) })
      my.hideLoading(true);
    } else {
      console.log('22222')
      my.hideLoading(true);
    }
    my.hideLoading(true);
    setTimeout(() => {
      this.setData({ isScanVisible: false });
    }, 1500);
  },
});
