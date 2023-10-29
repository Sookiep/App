import { SCENE_ABILITY, CHARACTERUSTIC_SERVICE, IMAGE_TECHNOLOGY, UNDER_DEVELOPMENT } from '../../common/constant/ocrtype';
Page({
  data: {
    tabs: [
      { title: '通用能力', number: '0' }
    ],
    SCENE_ABILITY, // 场景能力
    CHARACTERUSTIC_SERVICE, // 特色服务
    IMAGE_TECHNOLOGY, // 图像技术
    UNDER_DEVELOPMENT, // 未开发完成应用
    OCRType: '', // OCR
    activeTab: 0,
    hasContentHeight: false,
    type: 'market',
    show: false
  },
  // 未开发完提示
  showToastFail() {
    my.showToast({
      type: 'none',
      content: '功能开发中',
      duration: 2000,
    });
  },


  heightChange(e) {
    if (e.detail.value === 'hasnt') {
      this.setData({
        hasContentHeight: false,
      });
    } else {
      this.setData({
        hasContentHeight: true,
      });
    }
  },

  maskClick() {

    if (this.data.type === 'market') {
      this.setData({
        type: 'product',
      });
    } else {
      this.setData({
        type: 'market',
        show: false,
      });
    }
  },

  handleTabClick({ index, tabsName }) {
    this.setData({
      [tabsName]: index,
    });
  },
  handleTabChange({ index, tabsName }) {
    this.setData({
      [tabsName]: index,
    });
  },

  // 获取要跳转的页面
  getNavUrl(title, param) {
    let paramStr = '';
    if (param) {
      const paramList = Object.keys(param);
      paramStr = paramList.reduce((acc, current, index) => {
        const isLastItem = index === paramList.length - 1;
        const paramItemVal = param[current];
        return `${acc}${current}=${paramItemVal}${isLastItem ? '&' : ''}`
      }, '?');
    }

    console.log("title", title, "param", param);
    

    switch (title) {
      case 'OCR': return `/pages/result/result${paramStr}`;
      case '图像分类': return `/pages/result/result${paramStr}`;
      case '物体检测': return `/pages/result/result${paramStr}`;
      case '智能引导': return `/pages/AICamera/AICamera${paramStr}`;
      case '图像分割': return `/pages/result/result${paramStr}`;
      case '特色服务': return `/pages/result/result${paramStr}`;
      case '生活应用': return `/pages/result/result${paramStr}`;
      case '医疗凭证': return `/pages/result/result${paramStr}`;
      case '金融票据': return `/pages/result/result${paramStr}`;
      case '商家证件&经营场景': return `/pages/result/result${paramStr}`;
    }
  },

  onLoad() {

    my.setCanPullDown({
      canPullDown: false
    })
    // my.reLaunch({ url: '/pages/result/result' })
    // my.reLaunch({ url: '/pages/AICamera/AICamera' })
  },

});
