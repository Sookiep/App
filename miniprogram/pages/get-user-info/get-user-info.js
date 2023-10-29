var app = getApp()
Page({
  data: {
    nickname: '账户名', //用户昵称
    avatar: '', //用户头像
    isLogin: false, //是否登录
    isAvatar: false, //是否获取头像
    isAvatarLoading: false, //获取头像loading
    isLoginLoading: false //
  },
  getUserInfo() {
    my.getAuthCode({
      scopes: 'auth_user',
      fail: (error) => {
        console.error('getAuthCode', error);
      },
      success: ({
        authCode
      }) => {
        // do login...
        // then
        console.log(`authCode:`, authCode);
        // var context = await my.getCloudContext();
        return my.fncontext.callFunction({
          name: 'AlipayUserInfo',
          data: {
            auth_code: authCode
          },
        }).then(({
          result: userInfo
        }) => {
          console.log(`userInfo:`, userInfo);
          // 将 nick_name 改为 nickName
          userInfo.nickName = userInfo.nick_name;
          delete userInfo.nick_name;
          this.setData({
            userInfo,
            hasUserInfo: true,
          });
          // abridge.alert({
          //   title: JSON.stringify(userInfo), // alert 框的标题
          // });
        }).catch(error => {
          console.error('getAuthUserInfo', error);
        });
      }
    });
  },
  clear() {
    this.setData({
      hasUserInfo: false,
      userInfo: {}
    })
  }
})