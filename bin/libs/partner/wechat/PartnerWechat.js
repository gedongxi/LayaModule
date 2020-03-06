console.log("###########PartnerWechat .....");
Partner = Partner.extends();
Partner.PARTNER_NAME = "Wechat";
Partner.PARTNER_ID = 100001;
Partner.CDN_HOST = "https://cdn-game02.dayukeji.com/tank/";//这个打包的时候会重置
Partner.HEAD_IMG_HOST = "https://cdn-game02.dayukeji.com/resource/wxhead/"; //这个打包的时候会重置
Partner.WECHAT_GROUP_HOST = "https://xyx-gate04.dayukeji.com/wxq/tank/last?time=";
Partner.userInfoBtn = null;

Partner.DEBUG_INFO = false;
// 是否支持分享
Partner.SUPPORT_SHARE = true;

Partner.init = function () {
    Partner.showShareMenu(); //显示转发按钮
    Partner.registerUpdata(); //检查版本更新
    Partner.registerShareAppCallback(null);//右上角转发注册
}

// 解压配置文件 用jszip来解压。不同运行时会需要不同的类库来解压文件
Partner.unzipConfig = function (fileBin) {
    console.log("=========================XXXXXXXXXXXXXXXX unzipConfig", Partner.PARTNER_NAME);

    var originalBytes = new Uint8Array(fileBin);

    var files = {};
    var zipFile = new Zlib.Unzip(originalBytes, { verify: false });
    var fileNames = zipFile.getFilenames();
    var n = fileNames.length;
    for (var i = 0; i < n; i++) {
        var fileName = fileNames[i];
        var fileData = zipFile.decompress(fileName);
        files[fileName] = fileData;
    }
    return files;
};

Partner.doAccAuthorize = function (didAccAuthorizeCallback, inputAccountCallback, existSaved) {
    login(didAccAuthorizeCallback, inputAccountCallback, existSaved);
};

// 微信登陆
function login(didAccAuthorizeCallback, inputAccountCallback, existSaved) {
    const data = {};
    data.openid = "";
    data.openkey = "";
    data.platform = Partner.PARTNER_NAME;
    data.params = "";

    wx.login({
        success: function (res) {
            data.openid = res.code;
            // 登陆获取授权信息
            login2Authorize(didAccAuthorizeCallback, inputAccountCallback, existSaved, data);
        }
    });
};

// 登录之后看下有没有获取用户的授权
function login2Authorize(didAccAuthorizeCallback, inputAccountCallback, existSaved, data) {
    wx.getSetting({
        success: function (res) {
            if (res.authSetting["scope.userInfo"]) {
                // 已经授权
                authorize2UserInfo(didAccAuthorizeCallback, inputAccountCallback, existSaved, data)
            } else {
                // 尚未授权 直接进入游戏
                const res = {};
                var launchOpts = wx.getLaunchOptionsSync();
                res.launch = launchOpts;
                data.params = JSON.stringify(res);
                didAccAuthorizeCallback(data);
                inputAccountCallback(0);
            }
        }
    });
};

// 授权后获取用户信息 然后进游戏
function authorize2UserInfo(didAccAuthorizeCallback, inputAccountCallback, existSaved, data) {
    wx.getUserInfo({
        withCredentials: true,
        success: function (res) {
            const launchOpts = wx.getLaunchOptionsSync();
            res.launch = launchOpts;
            data.params = JSON.stringify(res);
            didAccAuthorizeCallback(data);
            inputAccountCallback(0);
        },
        fail: function (failedRes) {
            const res = {};
            const launchOpts = wx.getLaunchOptionsSync();
            res.launch = launchOpts;
            data.params = JSON.stringify(res);
            didAccAuthorizeCallback(data);
            inputAccountCallback(0);
        }
    });
};

// 设置授权信息, 如果没有授权则创建授权按钮
Partner.setAuthorize = function (x, y, width, height, callback) {
    console.log("setAuthorize====>x,y,width,height", x, y, width, height);
    if (Partner.userInfoBtn) {
        return;
    }
    Partner.checkIsAuthorizeScope("scope.userInfo", (isAuth) => {
        console.log("****checkIsAuthorizeScope isAuth =", isAuth);
        if (!isAuth) {
            createUserInfoButton(x, y, width, height, callback);
        }
    });
};

// 检查是否授权某项功能
/**
 * @scope 
 * scope.userInfo 用户信息
 * scope.userLocation 地理位置
 * scope.werun 微信运动步数
 * scope.writePhotosAlbum 保存到相册
 */
Partner.checkIsAuthorizeScope = function (scope, callback) {
    wx.getSetting({
        success(res) {
            console.log("****res.authSetting =", res.authSetting);
            callback && callback(!!res.authSetting[scope]);
        }
    });
};

function createUserInfoButton(x, y, width, height, callback) {
    let info = wx.getSystemInfoSync();
    let pixelRatio = info.pixelRatio;
    let button = wx.createUserInfoButton({
        type: 'text',
        text: '',
        style: {
            left: x / pixelRatio,
            top: y / pixelRatio,
            width: width / pixelRatio,
            height: height / pixelRatio,
        }
    })
    button.onTap((res) => {
        console.log("******createUserInfoButton onTap res=", res);
        if (res["userInfo"]) {
            wx.login({
                success: function (loginRes) {
                    res.login_code = loginRes.code;
                    callback && callback(JSON.stringify(res));
                }
            });

            button.destroy();
            Partner.userInfoBtn = false;
        }
    })

    Partner.userInfoBtn = button;
};

// 显示授权按钮
Partner.showUserInfoBtn = function () {
    Partner.userInfoBtn && Partner.userInfoBtn.show();
};

// 隐藏授权按钮
Partner.hideUserInfoBtn = function () {
    Partner.userInfoBtn && Partner.userInfoBtn.hide();
};

// 生命周期函数
Partner.registerOnShowCallback = function (callback) {
    wx.onShow(callback);
};

Partner.registerOnHideCallback = function (callback) {
    wx.onHide(callback);
};

// 注册监听音频中断操作
Partner.registerOnAudioInterruptionEndCallback = function (callback) {
    wx.onAudioInterruptionEnd(callback);
};

Partner.playVideo = function () {
};

Partner.getSystemInfo = function () {
    var sysInfo = wx.getSystemInfoSync();
    var launchInfo = wx.getLaunchOptionsSync();
    var from = "";
    if (launchInfo.scene === 1037 || launchInfo.scene === 1038) {
        from = from + launchInfo.scene + "" + "&referrerInfo= " + JSON.stringify(launchInfo.referrerInfo);
    } else {
        from = from + launchInfo.scene;
    }
    var info = {
        "model": sysInfo.model,
        "os": sysInfo.system,
        "version": sysInfo.version,
        "from": from,
    };
    return info;
};

//显示分享按钮
Partner.showShareMenu = function () {
    wx.showShareMenu();
};

//隐藏分享按钮
Partner.hideShareMenu = function () {
    wx.hideShareMenu();
};

Partner.registerShareAppCallback = function (callback) {
    if (callback) {
        wx.onShareAppMessage(callback);
    } else {
        wx.onShareAppMessage(() => {
            return {
                title: "技能自由搭配，弓箭高能对决！",
                imageUrl: Partner.SHARE_IMG_HOST + `arrow_game_xyx_banner.jpg`,
            }
        });
    }
};

// 邀请好友
Partner.doInvite = function (params) {
    wx.shareAppMessage(params);
};

// 更新
Partner.registerUpdata = function () {
    if (typeof wx.getUpdateManager === 'function') {
        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            console.log(res.hasUpdate)
        })
        var times = Laya.LocalStorage.getItem("update");
        if (!times) {
            Laya.LocalStorage.setItem("update", 0);
        }

        updateManager.onUpdateReady(function () {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            Laya.LocalStorage.setItem("update", 0);
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                showCancel: false,
                success(res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                    }
                }
            });
        })

        updateManager.onUpdateFailed(function () { //onUpdateFailed
            // 新的版本下载失败
            var times = Laya.LocalStorage.getItem("update");
            times = times + 1;
            if (times > 5) {
                wx.showModal({
                    title: '已经有新版本了哟~',
                    content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
                })
            } else {
                Laya.LocalStorage.setItem("update", times);
            }
        });
    }
};

// 短震动
Partner.vibrateShort = function () {
    wx.vibrateShort({
        success() {
        }
    });
};

//退出游戏
Partner.exitGame = function () {
    wx.exitMiniProgram();
};

// 对话框
Partner.showModal = function (title, content, showCancel, sureCbk, cancelCbk) {
    if (!title) {
        title = "提示";
    }
    wx.showModal({
        title: title,
        content: content,
        showCancel: showCancel,
        success(res) {
            if (res.confirm) {
                console.log('用户点击确定')
                sureCbk && sureCbk();
            } else if (res.cancel) {
                console.log('用户点击取消')
                cancelCbk && cancelCbk();
            }
        }
    })
};

// 预览图片
Partner.previewImage = function (params) {
    let url = Partner.WECHAT_GROUP_HOST + new Date().getTime();
    params = params || {
        current: url,
        urls: [
            url,
        ]
    }
    wx.previewImage({
        current: params.current, // 当前显示图片的http链接
        urls: params.urls || [], // 需要预览的图片http链接列表
        success: function () {

        },
        fail: function (msg) {
            console.error("previewImage:", msg)
        }
    })
};

// ======================== 支持相关 ====================
Partner.supportShare = function () {
    return true;
};

//==================== bee ======================
//小蜜蜂打点，目前最多支持20个埋点
Partner.beeGameStage = function (type) {
    wx.beeGameStage(type);
};

Partner.beeStartVideo = function () {
    wx.beeStartVideo();
};

Partner.beeFinishVideo = function () {
    wx.beeFinishVideo();
};

// ======================= 广告 ======================

// 跟功能id对应
Partner.rewardIds = {};
Partner.rewardIds[1] = "adunit-e07d0cf5ec67d1a3"; //主界面宝箱
Partner.rewardIds[2] = "adunit-b23b0736a88ee138"; //天梯奖励
Partner.rewardIds[3] = "adunit-ba4798f2135a8327"; //结算双倍buff
Partner.rewardIds[4] = "adunit-3ae3e798bc67d927"; //金币不足
Partner.rewardIds[5] = "adunit-e07d0cf5ec67d1a3"; //广告宝箱的弹窗的看广告按钮
Partner.RewardId = null;

Partner.initVideoAd = function () {
    const key = Partner.rewardIds[1];
    let videoAd = wx.createRewardedVideoAd({ adUnitId: key, multiton: false });

    videoAd.onError(function (res) {
        console.log("加载视频广告失败：", res)
        Partner.videoCallback(2, res);
    });

    videoAd.onClose(function (res) {
        if (res.isEnded) {
            console.log("观看成功");
            Partner.videoCallback(1);
        } else {
            Partner.videoCallback(0);
        }
    });
};

Partner.showVideoAd = function (id, cb) {
    Partner.videoCallback = cb;
    const key = Partner.rewardIds[id];
    let videoAd = wx.createRewardedVideoAd({ adUnitId: key, multiton: false });

    

    videoAd.load()
        .then(() => {
            console.log("拉取成功");
            videoAd.show()
                .then(() => {
                    console.log("拉取播放成功");
                })
                .catch(function (err) {
                    console.log("播放失败:", err);
                    Partner.AdErrMsg = JSON.stringify(err);
                });
        })
        .catch(() => { console.log("拉取失败") });
};

// 子包加载相关
Partner.loadSubPackage = function (subName, callback) {
    loadSubpackage(subName, callback);
};

// 加载子包
var loadSubpackage = function (packName, callback) {
    wx.loadSubpackage({
        name: packName,
        success: function (res) {
            callback();
        },
        fail: function (res) {
            setTimeout(function () { loadSubpackage(packName, callback); }, 1000);
        }
    });
};


// ======================= 性能相关 ======================
Partner.onMemoryWarning = function (cb) {
    wx.onMemoryWarning((res) => {
        cb(res);
    })
};

Partner.triggerGC = function () {
    // console.error("triggerGC")
    wx.triggerGC();
};
