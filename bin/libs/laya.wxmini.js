window.wxMiniGame = function (exports, Laya) {
	'use strict';

	var CACHE_URL_REG = /[\/:]/g;
	var OUT_STORAGE_TEST = /the maximum size of the file storage/;

	class MiniFileMgr {
	    static isLocalNativeFile(url) {
			var fileUrl = Laya.URL.calcRealUrl(url);
			if (window.__DYLayaMiniNativeFileMap[fileUrl]) {
				return true;
			}
	        return false;
        }

		static getCacheName(url) {
			return url.replace(CACHE_URL_REG, '-');
		}

		// 接口被导出了 暂时不删除
	    static getFileInfo(fileUrl) {
	        var fileNativePath = fileUrl;
	        var fileObj = MiniFileMgr.fakeObj[fileNativePath];
	        if (fileObj == null) {
				return null;
			}
	        else {
				return fileObj;
			}
		}
				
	    static readFile(filePath, encoding = "utf8", callBack = null, readyUrl = "", isSaveFile = false, fileType = "", isAutoClear = true) {
			filePath = Laya.URL.getAdptedFilePath(filePath);
	        MiniFileMgr.fs.readFile({
				filePath: filePath, 
				encoding: encoding, 
				success: function (data) {
					callBack != null && callBack.runWith([0, data]);
				}, 
				fail: function (data) {
					if (data) {
						callBack != null && callBack.runWith([1, data]);
					}
				}
			});
		}
		
		// 下载远程文件
		static downloadRemoteFile(remoteUrl, callBack = null, cacheFileName) {
			if (!cacheFileName) {
				throw(new Error("cache file name can't not be empty"));
			}

			var cacheFilePath = undefined;
			// 微信头像不缓存
			var isTemp = remoteUrl.indexOf("qlogo.cn") != -1;
			if (!isTemp) {
				cacheFilePath = MiniFileMgr.getCachedFullPath(cacheFileName);
			}

	        MiniFileMgr.wxdown({
				url: remoteUrl,
				filePath: cacheFilePath,
				success: function (data) {
	            	if (data.statusCode === 200) {
						var isNeedCopy = false;
						var destFilePath = data.filePath;
						if (!destFilePath) {
							isNeedCopy = true;
							destFilePath = data.tempFilePath;
						}
						callBack != null && callBack.runWith([0, destFilePath]);
						if (!isTemp) {
							MiniFileMgr.cacheFile(data.tempFilePath, cacheFileName, isNeedCopy);
						}
	            	}
	            	else {
						// 测试是否是空间占用满了
						if (OUT_STORAGE_TEST.test(data.errMsg)) {
							console.error("out of storage");
							// 先暂时暴力全部清除
							MiniFileMgr.clearAllCaches();
						}
	                	callBack != null && callBack.runWith([1, data]);
	            	}
				}, 
				fail: function (data) {
                    // 测试是否是空间占用满了
					if (OUT_STORAGE_TEST.test(data.errMsg)) {
						console.error("out of storage");
						// 先暂时暴力全部清除
						MiniFileMgr.clearAllCaches();
					}
	            	callBack != null && callBack.runWith([1, data]);
				}
			});
		}

		// 缓存文件 TODO 做下缓存满了后的处理
		static cacheFile(srcFullPath, cacheFileName, isCopy) {
			if (isCopy) {
				var destFullPath = MiniFileMgr.getCachedFullPath(cacheFileName);
				MiniFileMgr.fs.copyFile({
					srcPath:  srcFullPath,
					destPath: destFullPath,
					success: function(res) {
						MiniFileMgr.cachedFiles[cacheFileName] = 1;
						MiniFileMgr.writeCacheFile();
					},
					fail: function (res) {
					}
				});
			} else {
				MiniFileMgr.cachedFiles[cacheFileName] = 1;
				MiniFileMgr.writeCacheFile();
			}
		}

		// 更新cachefile
		static writeCacheFile(callback) {
			MiniFileMgr.write(MiniFileMgr.cachedFileName, JSON.stringify(MiniFileMgr.cachedFiles), "utf8", callback);
		}

		// 清除所有的缓存文件
		static clearAllCaches() {
			MiniFileMgr.fs.readdir({
				dirPath: MiniFileMgr.cacheDir,
				success: function(res) {
					var fileList = res.files;
					var toDeleteList = [];
					for(var i = 0; i < fileList.length; i++) {
						var fileName = fileList[i];
						if (fileName === MiniFileMgr.cachedFileName) {
							continue;
						}
						delete MiniFileMgr.cachedFiles[fileName];
						toDeleteList.push(fileName);
					}

					// 执行删除的回调
					var doDelete = function(err) {
						if (err != null) {
							console.error("write cache file fail:", err.message);
							return;
						}
						for (var i = 0; i < toDeleteList.length; i++) {
							var toDeleteFile = toDeleteList[i];
							// 又被重新下载了 就跳过
							if (toDeleteFile in MiniFileMgr.cachedFiles) {
								continue;
							}
							MiniFileMgr.removeFile(MiniFileMgr.getCachedFullPath(toDeleteFile), null);
						}
					};
					var callback = new Laya.Handler(null, doDelete, []);
					MiniFileMgr.writeCacheFile(callback);
				},
				fail: function(res) {
					console.error("clearAllCaches:", res.errMsg);
				}
			});
		}

		// 移除文件
		static removeFile(filePath, callBack) {
			MiniFileMgr.fs.unlink({
				filePath: filePath,
				success: function() {
					callBack && callBack.runWith([null]);
				},
				fail: function(res) {
					callBack && callBack.runWith([new Error(res.errMsg)]);
				}
			});
		}
				
	    static getNativeFullPath(fileName) {
	        return MiniFileMgr.fileNativeDir + "/" + fileName;
		}

		static getCachedFullPath(fileName) {
			return MiniFileMgr.cacheDir + "/" + fileName;
		}
		
	    static makeCacheDir(dirPath, callBack) {
			try {
                if (MiniFileMgr.fs.rmdir) {
                    MiniFileMgr.fs.rmdir({
                        dirPath: MiniFileMgr.fileNativeDir,
                        recursive: true,
                        success: function(){},
                        fail: function(){}
                    });
                }
				MiniFileMgr.fs.mkdirSync(dirPath, true);
				var initContent = JSON.stringify({});
                MiniFileMgr.writeSync(MiniFileMgr.cachedFileName, initContent),
				callBack != null && callBack.runWith([0, { data: initContent }]);
			} catch (e) {
				if (e.message.indexOf("file already exists") != -1) {
					MiniFileMgr.readSync(MiniFileMgr.cachedFileName, "utf8", callBack);
				} 
				else {
					callBack != null && callBack.runWith([1, e]);
				}
			}
		}

	    static readSync(filePath, encoding = "utf8", callBack = null, readyUrl = "") {
	        var fileUrl = MiniFileMgr.getCachedFullPath(filePath);
	        var fileContent;
	        try {
	            fileContent = MiniFileMgr.fs.readFileSync(fileUrl, encoding);
	            callBack != null && callBack.runWith([0, { data: fileContent }]);
	        }
	        catch (error) {
	            callBack != null && callBack.runWith([1]);
	        }
		}

		static writeSync(fileName, data, encoding = "utf8") {
			var filePath = MiniFileMgr.getCachedFullPath(fileName);
			try {
				MiniFileMgr.fs.writeFileSync(filePath, data, encoding);
				return null;
			}
			catch (e) {
				console.warn(e.message);
				return new Error(e.message);
			}
		}

		static write(fileName, data, encoding = "utf8", callBack) {
			var path = MiniFileMgr.getCachedFullPath(fileName);
			MiniFileMgr.fs.writeFile({
				filePath: path,
				encoding: encoding,
				data: data,
				success: function() {
					callBack != null && callBack.runWith([null]);
				},
				fail: function(res) {
					callBack != null && callBack.runWith([new Error(res.errMsg)]);
				}
			});
		}
		
	    static setCacheDir(value) {
			MiniFileMgr.fileNativeDir = MiniAdpter.window.wx.env.USER_DATA_PATH + "/layaairGame";
			MiniFileMgr.cacheDir      = MiniAdpter.window.wx.env.USER_DATA_PATH + '/gamecaches';
		}
	}

	MiniFileMgr.fs             		= window.wx.getFileSystemManager();
	MiniFileMgr.wxdown         		= window.wx.downloadFile;

	MiniFileMgr.filesListObj   		= {};
	MiniFileMgr.fakeObj        		= {};
	MiniFileMgr.fileListName   		= "layaairfiles.txt";

	MiniFileMgr.cachedFiles    		= {};
	MiniFileMgr.cachedFileName 		= "cacheList.json";
	MiniFileMgr.cacheDir       		= null;
	MiniFileMgr.usrDir       		= window.wx.env.USER_DATA_PATH;

	MiniFileMgr.ziyuFileData   		= {};
	MiniFileMgr.ziyuFileTextureData = {};
	MiniFileMgr.loadPath   			= "";
	MiniFileMgr.DESCENDING 			= 2;
	MiniFileMgr.NUMERIC    			= 16;

	class MiniSoundChannel extends Laya.SoundChannel {
	    constructor(audio, miniSound) {
			super();
			this._isWaitingToPlay = false;
	        this._audio = audio;
	        this._miniSound = miniSound;
	        this._onEnd = MiniSoundChannel.bindToThis(this.__onEnd, this);
			audio.onEnded(this._onEnd);
			if (!this._miniSound.loaded) {
				this._miniSound.on(Laya.Event.COMPLETE, this, this.__canPlay);
			}
		}
		
	    static bindToThis(fun, scope) {
	        var rst = fun;
	        rst = fun.bind(scope);
	        return rst;
		}
		
	    __onEnd() {
	        if (this.loops == 1) {
	            if (this.completeHandler) {
	                Laya.Laya.systemTimer.once(10, this, this.__runComplete, [this.completeHandler], false);
	                this.completeHandler = null;
	            }
	            this.stop();
	            this.event(Laya.Event.COMPLETE);
	            return;
	        }
	        if (this.loops > 0) {
	            this.loops--;
	        }
	        this.startTime = 0;
	        this.play();
		}
		
	    play() {
			this.isStopped = false;
			//console.error("######MiniSoundChannel play:", this._miniSound.loaded);
			Laya.SoundManager.addChannel(this);
			if (this._miniSound.loaded) {
				this._audio.play();
			}
			else {
				this._isWaitingToPlay = true;
			}
		}
		__canPlay() {
			if (this.isStopped) {
				return;
			}
			if (!this._isWaitingToPlay) {
				return;
			}
			//console.error("#####is waiting to play:", this._isWaitingToPlay);
			this._isWaitingToPlay = false;
			this._audio.play();
		}

	    set startTime(time) {
	        if (this._audio) {
	            this._audio.startTime = time;
	        }
	    }
	    set autoplay(value) {
	        this._audio.autoplay = value;
	    }
	    get autoplay() {
	        return this._audio.autoplay;
	    }
	    get position() {
	        if (!this._audio)
	            return 0;
	        return this._audio.currentTime;
	    }
	    get duration() {
	        if (!this._audio)
	            return 0;
	        return this._audio.duration;
	    }
	    stop() {
			//console.error("###MusicChannel stop");
	        this.isStopped = true;
	        Laya.SoundManager.removeChannel(this);
			this.completeHandler = null;
			if (this._miniSound) {
				if (!this._miniSound.loaded) {
					this._miniSound.off(Laya.Event.COMPLETE, this, this.__canPlay);
				}
			}
	        if (!this._audio) {
				return;
			}
			this._audio.stop();
			if (this._miniSound.url == Laya.SoundManager._bgMusic) {
				MiniSound._musicAudio = null;
			}
	        if (!this.loop) {
	            this._audio.offEnded(null);
	            this._miniSound.dispose();
	            this._audio = null;
	            this._miniSound = null;
	            this._onEnd = null;
	        }
	    }
	    pause() {
	        this.isStopped = true;
	        this._audio.pause();
	    }
	    get loop() {
	        return this._audio.loop;
	    }
	    set loop(value) {
	        this._audio.loop = value;
	    }
	    resume() {
	        if (!this._audio) {
				return;
			}
	        this.isStopped = false;
	        Laya.SoundManager.addChannel(this);
	        this._audio.play();
	    }
	    set volume(v) {
	        if (!this._audio)
	            return;
	        this._audio.volume = v;
	    }
	    get volume() {
	        if (!this._audio)
	            return 1;
	        return this._audio.volume;
	    }
	}

	class MiniSound extends Laya.EventDispatcher {
	    constructor() {
	        super();
			this.loaded  = false;
			this.waiting = false; // waiting for play
		}
		
	    static _createSound() {
	        MiniSound._id++;
	        return MiniAdpter.window.wx.createInnerAudioContext();
		}
		
	    load(url) {
			this.url     = url;
			// 计算url对应文件的真实路径
			var filePath = Laya.URL.calcRealUrl(url);
			// 创建sound
			this._sound = MiniSound._createSound();
			this._sound.onCanplay(MiniSound.bindToThis(this.onCanPlay, this));
			this._sound.onError(MiniSound.bindToThis(this.onError, this));
			// 如果是随包的文件
			if (MiniFileMgr.isLocalNativeFile(url)) {
				this._onSoundDownload(0, filePath);
				return;
			}
			// 使用就是本地的地址
			if (url.indexOf(MiniFileMgr.usrDir) != -1) {
				this._onSoundDownload(0, url);
				return;
			}
			// 是否在缓存中
			var cacheFileName = MiniFileMgr.getCacheName(filePath);
			if (cacheFileName in MiniFileMgr.cachedFiles) {
				var fileFullPath = MiniFileMgr.getCachedFullPath(cacheFileName);
				this._onSoundDownload(0, fileFullPath);
				return;
			}
			// 本地没有则从远程下载
			var remoteUrl = Laya.URL.calcRealUrl(url, true);
			MiniFileMgr.downloadRemoteFile(remoteUrl, Laya.Handler.create(this, this._onSoundDownload, []), cacheFileName);
		}
	    _onSoundDownload(errorCode, filePath) {
	        if (!errorCode) {
                if (this._sound) {
                    this._sound.src = filePath;
                }
	        }
	        else {
	            this.event(Laya.Event.ERROR);
	        }
		}
		
	    onError(error) {
	        try {
	            console.log("-----1---------------minisound-----id:" + MiniSound._id);
	            console.log(error);
	        }
	        catch (error) {
	            console.error("-----2---------------minisound-----id:" + MiniSound._id);
	            console.error(error);
	        }
	        this.event(Laya.Event.ERROR);
			this._sound.offError(null);
			this._sound.offCanplay(null);
		}
		
	    onCanPlay() {
			//console.error("###MiniSound onCanPlay");
	        this.loaded = true;
	        this.event(Laya.Event.COMPLETE);
			this._sound.offCanplay(null);
			this._sound.offError(null);
		}
		
	    static bindToThis(fun, scope) {
	        var rst = fun;
	        rst = fun.bind(scope);
	        return rst;
		}
		
	    play(startTime = 0, loops = 0) {
	        var tSound;
	        if (this.url == Laya.SoundManager._bgMusic) {
				if (!MiniSound._musicAudio) {
					tSound = MiniSound._musicAudio = this._sound;
				} else {
					tSound = MiniSound._musicAudio;
				}
	        }
	        else {
	            tSound = this._sound;
			}
			
	        if (!tSound) {
				return null;
			}
			//console.error("###MiniSound play");

	        var channel   = new MiniSoundChannel(tSound, this);
	        channel.url   = this.url;
	        channel.loops = loops;
	        channel.loop  = (loops === 0 ? true : false);
	        channel.startTime = startTime;
			channel.play();
	        Laya.SoundManager.addChannel(channel);
	        return channel;
		}
		
	    get duration() {
	        return this._sound.duration;
		}
		
	    dispose() {
	        var ad = MiniSound._audioCache[this.readyUrl];
	        if (ad) {
	            ad.src = "";
	            if (ad._sound) {
	                ad._sound.destroy();
	                ad._sound = null;
	                ad = null;
	            }
	            delete MiniSound._audioCache[this.readyUrl];
	        }
	        if (this._sound) {
	            this._sound.destroy();
	            this._sound = null;
	            this.readyUrl = this.url = null;
			}
			this.loaded = false;
	    }
	}
	MiniSound._id = 0;
	MiniSound._audioCache = {};

	class MiniInput {
	    constructor() {
	    }
	    static _createInputElement() {
	        Laya.Input['_initInput'](Laya.Input['area'] = Laya.Browser.createElement("textarea"));
	        Laya.Input['_initInput'](Laya.Input['input'] = Laya.Browser.createElement("input"));
	        Laya.Input['inputContainer'] = Laya.Browser.createElement("div");
	        Laya.Input['inputContainer'].style.position = "absolute";
	        Laya.Input['inputContainer'].style.zIndex = 1E5;
	        Laya.Browser.container.appendChild(Laya.Input['inputContainer']);
	        Laya.Laya.stage.on("resize", null, MiniInput._onStageResize);
	        MiniAdpter.window.wx.onWindowResize && MiniAdpter.window.wx.onWindowResize(function (res) {
	        });
	        Laya.SoundManager._soundClass = MiniSound;
	        Laya.SoundManager._musicClass = MiniSound;
	        var model = MiniAdpter.systemInfo.model;
	        var system = MiniAdpter.systemInfo.system;
	        if (model.indexOf("iPhone") != -1) {
	            Laya.Browser.onIPhone = true;
	            Laya.Browser.onIOS = true;
	            Laya.Browser.onIPad = true;
	            Laya.Browser.onAndroid = false;
	        }
	        if (system.indexOf("Android") != -1 || system.indexOf("Adr") != -1) {
	            Laya.Browser.onAndroid = true;
	            Laya.Browser.onIPhone = false;
	            Laya.Browser.onIOS = false;
	            Laya.Browser.onIPad = false;
	        }
	    }
	    static _onStageResize() {
	        var ts = Laya.Laya.stage._canvasTransform.identity();
	        ts.scale((Laya.Browser.width / Laya.Render.canvas.width / Laya.Browser.pixelRatio), Laya.Browser.height / Laya.Render.canvas.height / Laya.Browser.pixelRatio);
	    }
	    static wxinputFocus(e) {
	        var _inputTarget = Laya.Input['inputElement'].target;
	        if (_inputTarget && !_inputTarget.editable) {
	            return;
	        }
	        MiniAdpter.window.wx.offKeyboardConfirm();
	        MiniAdpter.window.wx.offKeyboardInput();
	        MiniAdpter.window.wx.showKeyboard({ defaultValue: _inputTarget.text, maxLength: _inputTarget.maxChars, multiple: _inputTarget.multiline, confirmHold: true, confirmType: _inputTarget["confirmType"] || 'done', success: function (res) {
	            }, fail: function (res) {
	            } });
	        MiniAdpter.window.wx.onKeyboardConfirm(function (res) {
	            var str = res ? res.value : "";
	            if (_inputTarget._restrictPattern) {
	                str = str.replace(/\u2006|\x27/g, "");
	                if (_inputTarget._restrictPattern.test(str)) {
	                    str = str.replace(_inputTarget._restrictPattern, "");
	                }
	            }
	            _inputTarget.text = str;
	            _inputTarget.event(Laya.Event.INPUT);
	            MiniInput.inputEnter();
	            _inputTarget.event("confirm");
	        });
	        MiniAdpter.window.wx.onKeyboardInput(function (res) {
	            var str = res ? res.value : "";
	            if (!_inputTarget.multiline) {
	                if (str.indexOf("\n") != -1) {
	                    MiniInput.inputEnter();
	                    return;
	                }
	            }
	            if (_inputTarget._restrictPattern) {
	                str = str.replace(/\u2006|\x27/g, "");
	                if (_inputTarget._restrictPattern.test(str)) {
	                    str = str.replace(_inputTarget._restrictPattern, "");
	                }
	            }
	            _inputTarget.text = str;
	            _inputTarget.event(Laya.Event.INPUT);
	        });
	    }
	    static inputEnter() {
	        Laya.Input['inputElement'].target.focus = false;
	    }
	    static wxinputblur() {
	        MiniInput.hideKeyboard();
	    }
	    static hideKeyboard() {
	        MiniAdpter.window.wx.offKeyboardConfirm();
	        MiniAdpter.window.wx.offKeyboardInput();
	        MiniAdpter.window.wx.hideKeyboard({ success: function (res) {
	                console.log('隐藏键盘');
	            }, fail: function (res) {
	                console.log("隐藏键盘出错:" + (res ? res.errMsg : ""));
	            } });
	    }
	}

	class MiniLoader extends Laya.EventDispatcher {
	    constructor() {
	        super();
		}
		
		// 下载资源的入口 (声音不是走的这个接口)
	    _loadResourceFilter(type, url) {
			// TODO 这里不应该出现空的url 目前测试微信版本，先这样兼容一下，稍后查出哪里传了空的资源地址 by Jingkun  2019.12.7
			if (!url) {
				return;
			}
			var thisLoader = this;
	        switch (type) {
	            case Laya.Loader.IMAGE:
	            case "htmlimage":
	            case "nativeimage":
					MiniLoader._loadImage(url, type, thisLoader);
	                break;
	            case Laya.Loader.SOUND:
	                thisLoader._loadSound(url);
	                break;
	            default:
	                thisLoader._loadResource(type, url);
	        }
		}
		
		// 这个函数应该是没有用到
	    _loadSound(url) {
			var thisLoader = this;
			var filePath = Laya.URL.calcRealUrl(url);
			// 如果是随包的文件
			if (MiniFileMgr.isLocalNativeFile(url)) {
				MiniLoader._HelperOnLoadSound(thisLoader, url, 0, filePath);
				return;
			}
			// 使用的就是本地文件
			if (url.indexOf(MiniFileMgr.usrDir) != -1) {
				MiniLoader._HelperOnLoadSound(thisLoader, url, 0, url);
				return;
			}
			// 是否在缓存中
			var cacheFileName = MiniFileMgr.getCacheName(filePath);
			if (cacheFileName in MiniFileMgr.cachedFiles) {
				var fileFullPath = MiniFileMgr.getCachedFullPath(cacheFileName);
				MiniLoader._HelperOnLoadSound(thisLoader, url, 0, fileFullPath);
				return;
			}
			// 本地没有从远程下载
			var remoteUrl = Laya.URL.calcRealUrl(url, true);
			MiniFileMgr.downloadRemoteFile(remoteUrl, Laya.Handler.create(this, this._HelperOnLoadSound, [thisLoader, url]), cacheFileName);
		}
	    static _HelperOnLoadSound(thisLoader, url, errorCode, filePath) {
	        if (!errorCode) {
	            var sound = (new Laya.SoundManager._soundClass());
	            sound.load(filePath);
	            thisLoader.onLoaded(sound);
	        }
	        else {
	            thisLoader.event(Laya.Event.ERROR, "Load sound failed");
	        }
		}	
	    static bindToThis(fun, scope) {
	        var rst = fun;
	        rst = fun.bind(scope);
	        return rst;
		}
		

	    _loadHttpRequestWhat(url, contentType) {
			var thisLoader = this;
			if (Laya.Loader.preLoadedMap[url]) {
				thisLoader.onLoaded(Laya.Loader.preLoadedMap[url]);
				return;
			}

			var encoding   = MiniAdpter.getUrlEncode(url, contentType);
			var filePath   = Laya.URL.calcRealUrl(url);
			// 如果是随包的文件
			if (MiniFileMgr.isLocalNativeFile(url)) {
				MiniFileMgr.readFile(filePath, encoding, new Laya.Handler(MiniLoader, MiniLoader.onReadWhatCallBack, [url, contentType, thisLoader]), url);
				return;
			}
			// 是否在缓存中
			var cachedFilePath = MiniFileMgr.getCacheName(filePath);
			if (cachedFilePath in MiniFileMgr.cachedFiles) {
				var fileFullPath = MiniFileMgr.getCachedFullPath(cachedFilePath);
				MiniFileMgr.readFile(fileFullPath, encoding, new Laya.Handler(MiniLoader, MiniLoader.onReadWhatCallBack, [url, contentType, thisLoader]), url);
				return;
			}
			// 本地没有则从远程下载
			var remoteUrl = Laya.URL.calcRealUrl(url, true);
			MiniFileMgr.downloadRemoteFile(remoteUrl, new Laya.Handler(MiniLoader, MiniLoader.onDownloadWhat, [url, contentType, encoding, thisLoader]), cachedFilePath);
		}
		static onDownloadWhat(url, contentType, encoding, thisLoader, errorCode, filePath) {
			if (!errorCode) {
				MiniFileMgr.readFile(filePath, encoding, new Laya.Handler(MiniLoader, MiniLoader.onReadWhatCallBack, [url, contentType, thisLoader]), url);
				return;
			}
			// 下载出错了
			MiniLoader.onReadWhatCallBack(url, contentType, thisLoader, errorCode, null);
		}
		// 成功读取了文件
	    static onReadWhatCallBack(url, contentType = null, thisLoader = null, errorCode = 0, data = null) {
	        if (!errorCode) {
	            var tempData;
	            if (contentType == Laya.Loader.JSON || contentType == Laya.Loader.ATLAS || contentType == Laya.Loader.PREFAB || contentType == Laya.Loader.PLF) {
	                tempData = MiniAdpter.getJson(data.data);
	            }
	            else if (contentType == Laya.Loader.XML) {
	                tempData = Laya.Utils.parseXMLFromString(data.data);
	            }
	            else {
	                tempData = data.data;
	            }
	            thisLoader.onLoaded(tempData);
	        }
	        else if (errorCode == 1) {
				// 再尝试一下直接用HttpRequest请求 目前不太清楚后续的处理 by Jingkun
	            thisLoader._loadHttpRequest(url, contentType, thisLoader, thisLoader.onLoaded, thisLoader, thisLoader.onProgress, thisLoader, thisLoader.onError);
	        }
		}

		// 加载图片
		static _loadImage(url, type, thisLoader) {
			// 计算url对应文件的真实路径
			var filePath = Laya.URL.calcRealUrl(url);
			// 如果是随包的文件
			if (MiniFileMgr.isLocalNativeFile(url)) {
				thisLoader.fileUrl = filePath;
				thisLoader._loadImage(url, false);
				return;
			}
			// 是否在缓存中
			var cachedFilePath = MiniFileMgr.getCacheName(filePath);
			if (cachedFilePath in MiniFileMgr.cachedFiles) {
				thisLoader.fileUrl = MiniFileMgr.getCachedFullPath(cachedFilePath);
				thisLoader._loadImage(url, false);
				return;
			}
			// 本地没有则从远程下载
			var remoteUrl = Laya.URL.calcRealUrl(url, true);
			MiniFileMgr.downloadRemoteFile(remoteUrl, new Laya.Handler(MiniLoader, MiniLoader.onDownImgCallBack, [url, thisLoader]), cachedFilePath);
		}
	    static onDownImgCallBack(url, thisLoader, errorCode, filePath) {
	        if (!errorCode) {
				thisLoader.fileUrl = filePath;
				thisLoader._loadImage(url, false);
			}
	        else {
	            thisLoader.onError(null);
	        }
		}
	}



	class MiniLocalStorage {
	    constructor() {
	    }
	    static __init__() {
	        MiniLocalStorage.items = MiniLocalStorage;
	    }
	    static setItem(key, value) {
	        try {
	            MiniAdpter.window.wx.setStorageSync(key, value);
	        }
	        catch (error) {
	            MiniAdpter.window.wx.setStorage({
	                key: key,
	                data: value
	            });
	        }
	    }
	    static getItem(key) {
	        return MiniAdpter.window.wx.getStorageSync(key);
	    }
	    static setJSON(key, value) {
	        MiniLocalStorage.setItem(key, value);
	    }
	    static getJSON(key) {
	        return MiniLocalStorage.getItem(key);
	    }
	    static removeItem(key) {
	        MiniAdpter.window.wx.removeStorageSync(key);
	    }
	    static clear() {
	        MiniAdpter.window.wx.clearStorageSync();
	    }
	    static getStorageInfoSync() {
	        try {
	            var res = MiniAdpter.window.wx.getStorageInfoSync();
	            console.log(res.keys);
	            console.log(res.currentSize);
	            console.log(res.limitSize);
	            return res;
	        }
	        catch (e) {
	        }
	        return null;
	    }
	}
	MiniLocalStorage.support = true;

	class MiniAdpter {
	    static getJson(data) {
	        return JSON.parse(data);
		}
		
	    static enable() {
	        MiniAdpter.init(Laya.Laya.isWXPosMsg, Laya.Laya.isWXOpenDataContext);
		}
		
	    static init(isPosMsg = false, isSon = false) {
	        if (MiniAdpter._inited) {
				return;
			}
	        MiniAdpter._inited = true;
	        MiniAdpter.window = window;
	        if (!MiniAdpter.window.hasOwnProperty("wx")) {
				return;
			}
	        if (MiniAdpter.window.navigator.userAgent.indexOf('MiniGame') < 0) {
				return;
			}

	        MiniAdpter.isZiYu = isSon;
	        MiniAdpter.isPosMsgYu = isPosMsg;
			MiniAdpter.EnvConfig = {};
			
	
	        MiniFileMgr.setCacheDir();
			MiniFileMgr.makeCacheDir(MiniFileMgr.cacheDir, Laya.Handler.create(MiniAdpter, MiniAdpter.onMkCacheDirCallBack));
			
	        MiniAdpter.systemInfo = MiniAdpter.window.wx.getSystemInfoSync();
	        MiniAdpter.window.focus = function () {
	        };
	        Laya.Laya['_getUrlPath'] = function () {
	            return "";
	        };
	        MiniAdpter.window.logtime = function (str) {
	        };
	        MiniAdpter.window.alertTimeLog = function (str) {
	        };
	        MiniAdpter.window.resetShareInfo = function () {
	        };
	        MiniAdpter.window.CanvasRenderingContext2D = function () {
	        };
	        MiniAdpter.window.CanvasRenderingContext2D.prototype = MiniAdpter.window.wx.createCanvas().getContext('2d').__proto__;
	        MiniAdpter.window.document.body.appendChild = function () {
	        };
	        MiniAdpter.EnvConfig.pixelRatioInt = 0;
	        Laya.Browser["_pixelRatio"] = MiniAdpter.pixelRatio();
	        MiniAdpter._preCreateElement = Laya.Browser.createElement;
	        Laya.Browser["createElement"] = MiniAdpter.createElement;
	        Laya.RunDriver.createShaderCondition = MiniAdpter.createShaderCondition;
	        Laya.Utils['parseXMLFromString'] = MiniAdpter.parseXMLFromString;
	        Laya.Input['_createInputElement'] = MiniInput['_createInputElement'];
	        Laya.Loader.prototype._loadResourceFilter = MiniLoader.prototype._loadResourceFilter;
	        Laya.Loader.prototype._loadSound = MiniLoader.prototype._loadSound;
	        Laya.Loader.prototype._loadHttpRequestWhat = MiniLoader.prototype._loadHttpRequestWhat;
	        Laya.LocalStorage._baseClass = MiniLocalStorage;
	        MiniLocalStorage.__init__();
	        MiniAdpter.window.wx.onMessage && MiniAdpter.window.wx.onMessage(MiniAdpter._onMessage);
		}
		
	    static _onMessage(data) {
	        switch (data.type) {
	            case "changeMatrix":
	                Laya.Laya.stage.transform.identity();
	                Laya.Laya.stage._width = data.w;
	                Laya.Laya.stage._height = data.h;
	                Laya.Laya.stage._canvasTransform = new Laya.Matrix(data.a, data.b, data.c, data.d, data.tx, data.ty);
	                break;
	            case "display":
	                Laya.Laya.stage.frameRate = data.rate || Laya.Stage.FRAME_FAST;
	                break;
	            case "undisplay":
	                Laya.Laya.stage.frameRate = Laya.Stage.FRAME_SLEEP;
	                break;
	        }
	        if (data['isLoad'] == "opendatacontext") {
	            if (data.url) {
	                MiniFileMgr.ziyuFileData[data.url] = data.atlasdata;
	                MiniFileMgr.ziyuFileTextureData[data.imgReadyUrl] = data.imgNativeUrl;
	            }
	        }
	        else if (data['isLoad'] == "openJsondatacontext") {
	            if (data.url) {
	                MiniFileMgr.ziyuFileData[data.url] = data.atlasdata;
	            }
	        }
	        else if (data['isLoad'] == "openJsondatacontextPic") {
	            MiniFileMgr.ziyuFileTextureData[data.imgReadyUrl] = data.imgNativeUrl;
	        }
	    }
	    static getUrlEncode(url, type) {
	        if (type == "arraybuffer")
	            return "";
	        return "utf8";
		}
		
	    static downLoadFile(url, fileType = "", callBack = null, encoding = "utf8") {
			var filePath = Laya.URL.calcRealUrl(url);

			// 是否在缓存中
			var cachedPath = MiniFileMgr.getCacheName(filePath);
			if (cachedPath in MiniFileMgr.cachedFiles) {
				if (fileType == Laya.Loader.IMAGE || fileType == Laya.Loader.SOUND) {
					var fullFilePath = MiniFileMgr.getCachedFullPath(cachedPath);
					callBack != null && callBack.runWith([0, fullFilePath]);
				} else {
					MiniFileMgr.readFile(fullFilePath, encoding, callBack);
				}
				return;
			}
			var remoteUrl = Laya.URL.calcRealUrl(url, true);
			MiniFileMgr.downloadRemoteFile(remoteUrl, new Laya.Handler(MiniAdpter, MiniAdpter.downloadFileCallback, [url, fileType, callBack, encoding]), cachedPath);
		}
		static downloadFileCallback(url, fileType, callBack, encoding, errorCode, filePath) {
			if (!errorCode) {
				if (fileType == Laya.Loader.IMAGE || fileType == Laya.Loader.SOUND) {
					callBack != null && callBack.runWith([0, filePath]);
				} else {
					MiniFileMgr.readFile(filePath, encoding, callBack);
				}
			} else {
				callBack != null && callBack.runWith([errorCode]);
			}
		}
		
	    static remove(fileUrl, callBack = null) {
	        //MiniFileMgr.deleteFile("", fileUrl, callBack, "", 0);
		}
		
	    static removeAll() {
	        MiniFileMgr.clearAllCaches();
	    }
	    static hasNativeFile(fileUrl) {
	        return MiniFileMgr.isLocalNativeFile(fileUrl);
	    }
	    static getFileInfo(fileUrl) {
	        return MiniFileMgr.getFileInfo(fileUrl);
	    }
	    static getFileList() {
	        return MiniFileMgr.filesListObj;
	    }
	    static exitMiniProgram() {
	        MiniAdpter.window["wx"].exitMiniProgram();
		}
		
	    static onMkCacheDirCallBack(errorCode, data) {
	        if (!errorCode) {
				MiniFileMgr.filesListObj = {};
				MiniFileMgr.cachedFiles = JSON.parse(data.data);
			}
	        MiniFileMgr.fakeObj = MiniFileMgr.filesListObj;
		}
		
	    static pixelRatio() {
	        if (!MiniAdpter.EnvConfig.pixelRatioInt) {
	            try {
	                MiniAdpter.EnvConfig.pixelRatioInt = MiniAdpter.systemInfo.pixelRatio;
	                return MiniAdpter.systemInfo.pixelRatio;
	            }
	            catch (error) {
	            }
	        }
	        return MiniAdpter.EnvConfig.pixelRatioInt;
	    }
	    static createElement(type) {
	        if (type == "canvas") {
	            var _source;
	            if (MiniAdpter.idx == 1) {
	                if (MiniAdpter.isZiYu) {
	                    _source = MiniAdpter.window.sharedCanvas;
	                    _source.style = {};
	                }
	                else {
	                    _source = MiniAdpter.window.canvas;
	                }
	            }
	            else {
	                _source = MiniAdpter.window.wx.createCanvas();
	            }
	            MiniAdpter.idx++;
	            return _source;
	        }
	        else if (type == "textarea" || type == "input") {
	            return MiniAdpter.onCreateInput(type);
	        }
	        else if (type == "div") {
	            var node = MiniAdpter._preCreateElement(type);
	            node.contains = function (value) {
	                return null;
	            };
	            node.removeChild = function (value) {
	            };
	            return node;
	        }
	        else {
	            return MiniAdpter._preCreateElement(type);
	        }
	    }
	    static onCreateInput(type) {
	        var node = MiniAdpter._preCreateElement(type);
	        node.focus = MiniInput.wxinputFocus;
	        node.blur = MiniInput.wxinputblur;
	        node.style = {};
	        node.value = 0;
	        node.parentElement = {};
	        node.placeholder = {};
	        node.type = {};
	        node.setColor = function (value) {
	        };
	        node.setType = function (value) {
	        };
	        node.setFontFace = function (value) {
	        };
	        node.addEventListener = function (value) {
	        };
	        node.contains = function (value) {
	            return null;
	        };
	        node.removeChild = function (value) {
	        };
	        return node;
	    }
	    static createShaderCondition(conditionScript) {
	        var func = function () {
	            return this[conditionScript.replace("this.", "")];
	        };
	        return func;
	    }
	    static sendAtlasToOpenDataContext(url) {
	        if (!MiniAdpter.isZiYu) {
	            var atlasJson = Laya.Loader.getRes(Laya.URL.formatURL(url));
	            if (atlasJson) {
	                var textureArr = atlasJson.meta.image.split(",");
	                if (atlasJson.meta && atlasJson.meta.image) {
	                    var toloadPics = atlasJson.meta.image.split(",");
	                    var split = url.indexOf("/") >= 0 ? "/" : "\\";
	                    var idx = url.lastIndexOf(split);
	                    var folderPath = idx >= 0 ? url.substr(0, idx + 1) : "";
	                    for (var i = 0, len = toloadPics.length; i < len; i++) {
	                        toloadPics[i] = folderPath + toloadPics[i];
	                    }
	                }
	                else {
	                    toloadPics = [url.replace(".json", ".png")];
	                }
	                for (i = 0; i < toloadPics.length; i++) {
	                    var tempAtlasPngUrl = toloadPics[i];
	                    MiniAdpter.postInfoToContext(Laya.Laya.URL.formatURL(url), Laya.Laya.URL.formatURL(tempAtlasPngUrl), atlasJson);
	                }
	            }
	            else {
	                throw "传递的url没有获取到对应的图集数据信息，请确保图集已经过！";
	            }
	        }
	    }
	    static postInfoToContext(url, atlaspngUrl, atlasJson) {
	        var postData = { "frames": atlasJson.frames, "meta": atlasJson.meta };
	        var textureUrl = atlaspngUrl;
	        var fileObj = MiniFileMgr.getFileInfo(Laya.URL.formatURL(atlaspngUrl));
	        if (fileObj) {
	            var fileMd5Name = fileObj.md5;
	            var fileNativeUrl = MiniFileMgr.getNativeFullPath(fileMd5Name);
	        }
	        else {
	            fileNativeUrl = textureUrl;
	        }
	        if (fileNativeUrl) {
	            MiniAdpter.window.wx.postMessage({ url: url, atlasdata: postData, imgNativeUrl: fileNativeUrl, imgReadyUrl: textureUrl, isLoad: "opendatacontext" });
	        }
	        else {
	            throw "获取图集的磁盘url路径不存在！";
	        }
	    }
	    static sendSinglePicToOpenDataContext(url) {
	        var tempTextureUrl = Laya.URL.formatURL(url);
	        var fileObj = MiniFileMgr.getFileInfo(tempTextureUrl);
	        if (fileObj) {
	            var fileMd5Name = fileObj.md5;
	            var fileNativeUrl = MiniFileMgr.getNativeFullPath(fileMd5Name);
	            url = tempTextureUrl;
	        }
	        else {
	            fileNativeUrl = url;
	        }
	        if (fileNativeUrl) {
	            url = Laya.Laya.URL.formatURL(url);
	            MiniAdpter.window.wx.postMessage({ url: url, imgNativeUrl: fileNativeUrl, imgReadyUrl: url, isLoad: "openJsondatacontextPic" });
	        }
	        else {
	            throw "获取图集的磁盘url路径不存在！";
	        }
	    }
	    static sendJsonDataToDataContext(url) {
	        if (!MiniAdpter.isZiYu) {
	            url = Laya.Laya.URL.formatURL(url);
	            var atlasJson = Laya.Loader.getRes(url);
	            if (atlasJson) {
	                MiniAdpter.window.wx.postMessage({ url: url, atlasdata: atlasJson, isLoad: "openJsondatacontext" });
	            }
	            else {
	                throw "传递的url没有获取到对应的图集数据信息，请确保图集已经过！";
	            }
	        }
	    }
	}
	MiniAdpter._inited = false;
	MiniAdpter.autoCacheFile = true;
	MiniAdpter.minClearSize = (5 * 1024 * 1024);
	MiniAdpter.nativefiles = ["layaNativeDir", "wxlocal"];
	MiniAdpter.subNativeFiles = [];
	MiniAdpter.subNativeheads = [];
	MiniAdpter.subMaps = [];
	MiniAdpter.AutoCacheDownFile = false;
	MiniAdpter.parseXMLFromString = function (value) {
	    var rst;
	    value = value.replace(/>\s+</g, '><');
	    try {
	        rst = (new MiniAdpter.window.Parser.DOMParser()).parseFromString(value, 'text/xml');
	    }
	    catch (error) {
	        throw "需要引入xml解析库文件";
	    }
	    return rst;
	};
	MiniAdpter.idx = 1;

	class MiniAccelerator extends Laya.EventDispatcher {
	    constructor() {
	        super();
	    }
	    static __init__() {
	        try {
	            var Acc;
	            Acc = Laya.Accelerator;
	            if (!Acc)
	                return;
	            Acc["prototype"]["on"] = MiniAccelerator["prototype"]["on"];
	            Acc["prototype"]["off"] = MiniAccelerator["prototype"]["off"];
	        }
	        catch (e) {
	        }
	    }
	    static startListen(callBack) {
	        MiniAccelerator._callBack = callBack;
	        if (MiniAccelerator._isListening)
	            return;
	        MiniAccelerator._isListening = true;
	        try {
	            MiniAdpter.window.wx.onAccelerometerChange(MiniAccelerator.onAccelerometerChange);
	        }
	        catch (e) { }
	    }
	    static stopListen() {
	        MiniAccelerator._isListening = false;
	        try {
	            MiniAdpter.window.wx.stopAccelerometer({});
	        }
	        catch (e) { }
	    }
	    static onAccelerometerChange(res) {
	        var e;
	        e = {};
	        e.acceleration = res;
	        e.accelerationIncludingGravity = res;
	        e.rotationRate = {};
	        if (MiniAccelerator._callBack != null) {
	            MiniAccelerator._callBack(e);
	        }
	    }
	    on(type, caller, listener, args = null) {
	        super.on(type, caller, listener, args);
	        MiniAccelerator.startListen(this["onDeviceOrientationChange"]);
	        return this;
	    }
	    off(type, caller, listener, onceOnly = false) {
	        if (!this.hasListener(type))
	            MiniAccelerator.stopListen();
	        return super.off(type, caller, listener, onceOnly);
	    }
	}
	MiniAccelerator._isListening = false;

	class MiniImage {
	    _loadImage(url) {
			var thisLoader = this;
			// 计算url对应文件的真实路径
			var filePath = Laya.URL.calcRealUrl(url);
			// 如果是随包的文件
			if (MiniFileMgr.isLocalNativeFile(url)) {
				MiniImage.onCreateImage(url, thisLoader, true, filePath);
				return;
			}
			// 是否在缓存中
			var cachedFilePath = MiniFileMgr.getCacheName(filePath);
			if (cachedFilePath in MiniFileMgr.cachedFiles) {
				var fileFullPath = MiniFileMgr.getCachedFullPath(cachedFilePath);
				MiniImage.onCreateImage(url, thisLoader, true, fileFullPath);
				return;
			}
			// 本地没有则从远程下载
			var remoteUrl = Laya.URL.calcRealUrl(url, true);
			MiniFileMgr.downloadRemoteFile(remoteUrl, new Laya.Handler(MiniImage, MiniImage.onDownImgCallBack, [url, thisLoader]), cachedFilePath);
	    }
	    static onDownImgCallBack(url, thisLoader, errorCode, filePath) {
	        if (!errorCode) {
				MiniImage.onCreateImage(url, thisLoader, true, filePath);
			}
	        else {
	            thisLoader.onError(null);
	        }
	    }
	    static onCreateImage(url, thisLoader, isLocal = false, filePath) {			
	        if (thisLoader._imgCache == null) {
				thisLoader._imgCache = {};
			}
	        var image;
	        function clear() {
	            var img = thisLoader._imgCache[url];
	            if (img) {
	                img.onload  = null;
	                img.onerror = null;
	                delete thisLoader._imgCache[url];
	            }
	        }
	        var onerror = function () {
	            clear();
				delete MiniFileMgr.cachedFiles[url];
	            thisLoader.event(Laya.Event.ERROR, "Load image failed");
	        };
	        if (thisLoader._type == "nativeimage") {
	            var onload = function () {
	                clear();
	                thisLoader.onLoaded(image);
	            };
	            image = new Laya.Browser.window.Image();
	            image.crossOrigin = "";
	            image.onload      = onload;
	            image.onerror     = onerror;
	            image.src         = filePath;
	            thisLoader._imgCache[url] = image;
	        }
	        else {
	            var imageSource = new Laya.Browser.window.Image();
	            onload = function () {
	                image = Laya.HTMLImage.create(imageSource.width, imageSource.height);
	                image.loadImageSource(imageSource, true);
	                image._setCreateURL(filePath);
	                clear();
	                thisLoader.onLoaded(image);
	            };
	            imageSource.crossOrigin = "";
	            imageSource.onload      = onload;
	            imageSource.onerror     = onerror;
	            imageSource.src         = filePath;
	            thisLoader._imgCache[url] = imageSource;
	        }
	    }
	}

	class MiniLocation {
	    constructor() {
	    }
	    static __init__() {
	        MiniAdpter.window.navigator.geolocation.getCurrentPosition = MiniLocation.getCurrentPosition;
	        MiniAdpter.window.navigator.geolocation.watchPosition = MiniLocation.watchPosition;
	        MiniAdpter.window.navigator.geolocation.clearWatch = MiniLocation.clearWatch;
	    }
	    static getCurrentPosition(success = null, error = null, options = null) {
	        var paramO;
	        paramO = {};
	        paramO.success = getSuccess;
	        paramO.fail = error;
	        MiniAdpter.window.wx.getLocation(paramO);
	        function getSuccess(res) {
	            if (success != null) {
	                success(res);
	            }
	        }
	    }
	    static watchPosition(success = null, error = null, options = null) {
	        MiniLocation._curID++;
	        var curWatchO;
	        curWatchO = {};
	        curWatchO.success = success;
	        curWatchO.error = error;
	        MiniLocation._watchDic[MiniLocation._curID] = curWatchO;
	        Laya.Laya.systemTimer.loop(1000, null, MiniLocation._myLoop);
	        return MiniLocation._curID;
	    }
	    static clearWatch(id) {
	        delete MiniLocation._watchDic[id];
	        if (!MiniLocation._hasWatch()) {
	            Laya.Laya.systemTimer.clear(null, MiniLocation._myLoop);
	        }
	    }
	    static _hasWatch() {
	        var key;
	        for (key in MiniLocation._watchDic) {
	            if (MiniLocation._watchDic[key])
	                return true;
	        }
	        return false;
	    }
	    static _myLoop() {
	        MiniLocation.getCurrentPosition(MiniLocation._mySuccess, MiniLocation._myError);
	    }
	    static _mySuccess(res) {
	        var rst = {};
	        rst.coords = res;
	        rst.timestamp = Laya.Browser.now();
	        var key;
	        for (key in MiniLocation._watchDic) {
	            if (MiniLocation._watchDic[key].success) {
	                MiniLocation._watchDic[key].success(rst);
	            }
	        }
	    }
	    static _myError(res) {
	        var key;
	        for (key in MiniLocation._watchDic) {
	            if (MiniLocation._watchDic[key].error) {
	                MiniLocation._watchDic[key].error(res);
	            }
	        }
	    }
	}
	MiniLocation._watchDic = {};
	MiniLocation._curID = 0;

	class MiniVideo {
	    constructor(width = 320, height = 240) {
	        this.videoend = false;
	        this.videourl = "";
	        this.videoElement = MiniAdpter.window.wx.createVideo({ width: width, height: height, autoplay: true });
	    }
	    static __init__() {
	    }
	    on(eventType, ths, callBack) {
	        if (eventType == "loadedmetadata") {
	            this.onPlayFunc = callBack.bind(ths);
	            this.videoElement.onPlay = this.onPlayFunction.bind(this);
	        }
	        else if (eventType == "ended") {
	            this.onEndedFunC = callBack.bind(ths);
	            this.videoElement.onEnded = this.onEndedFunction.bind(this);
	        }
	        this.videoElement.onTimeUpdate = this.onTimeUpdateFunc.bind(this);
	    }
	    onTimeUpdateFunc(data) {
	        this.position = data.position;
	        this._duration = data.duration;
	    }
	    get duration() {
	        return this._duration;
	    }
	    onPlayFunction() {
	        if (this.videoElement)
	            this.videoElement.readyState = 200;
	        console.log("=====视频加载完成========");
	        this.onPlayFunc != null && this.onPlayFunc();
	    }
	    onEndedFunction() {
	        if (!this.videoElement)
	            return;
	        this.videoend = true;
	        console.log("=====视频播放完毕========");
	        this.onEndedFunC != null && this.onEndedFunC();
	    }
	    off(eventType, ths, callBack) {
	        if (eventType == "loadedmetadata") {
	            this.onPlayFunc = callBack.bind(ths);
	            this.videoElement.offPlay = this.onPlayFunction.bind(this);
	        }
	        else if (eventType == "ended") {
	            this.onEndedFunC = callBack.bind(ths);
	            this.videoElement.offEnded = this.onEndedFunction.bind(this);
	        }
	    }
	    load(url) {
	        if (!this.videoElement)
	            return;
	        this.videoElement.src = url;
	    }
	    play() {
	        if (!this.videoElement)
	            return;
	        this.videoend = false;
	        this.videoElement.play();
	    }
	    pause() {
	        if (!this.videoElement)
	            return;
	        this.videoend = true;
	        this.videoElement.pause();
	    }
	    get currentTime() {
	        if (!this.videoElement)
	            return 0;
	        return this.videoElement.initialTime;
	    }
	    set currentTime(value) {
	        if (!this.videoElement)
	            return;
	        this.videoElement.initialTime = value;
	    }
	    get videoWidth() {
	        if (!this.videoElement)
	            return 0;
	        return this.videoElement.width;
	    }
	    get videoHeight() {
	        if (!this.videoElement)
	            return 0;
	        return this.videoElement.height;
	    }
	    get ended() {
	        return this.videoend;
	    }
	    get loop() {
	        if (!this.videoElement)
	            return false;
	        return this.videoElement.loop;
	    }
	    set loop(value) {
	        if (!this.videoElement)
	            return;
	        this.videoElement.loop = value;
	    }
	    get playbackRate() {
	        if (!this.videoElement)
	            return 0;
	        return this.videoElement.playbackRate;
	    }
	    set playbackRate(value) {
	        if (!this.videoElement)
	            return;
	        this.videoElement.playbackRate = value;
	    }
	    get muted() {
	        if (!this.videoElement)
	            return false;
	        return this.videoElement.muted;
	    }
	    set muted(value) {
	        if (!this.videoElement)
	            return;
	        this.videoElement.muted = value;
	    }
	    get paused() {
	        if (!this.videoElement)
	            return false;
	        return this.videoElement.paused;
	    }
	    size(width, height) {
	        if (!this.videoElement)
	            return;
	        this.videoElement.width = width;
	        this.videoElement.height = height;
	    }
	    get x() {
	        if (!this.videoElement)
	            return 0;
	        return this.videoElement.x;
	    }
	    set x(value) {
	        if (!this.videoElement)
	            return;
	        this.videoElement.x = value;
	    }
	    get y() {
	        if (!this.videoElement)
	            return 0;
	        return this.videoElement.y;
	    }
	    set y(value) {
	        if (!this.videoElement)
	            return;
	        this.videoElement.y = value;
	    }
	    get currentSrc() {
	        return this.videoElement.src;
	    }
	    destroy() {
	        if (this.videoElement)
	            this.videoElement.destroy();
	        this.videoElement = null;
	        this.onEndedFunC = null;
	        this.onPlayFunc = null;
	        this.videoend = false;
	        this.videourl = null;
	    }
	    reload() {
	        if (!this.videoElement)
	            return;
	        this.videoElement.src = this.videourl;
	    }
	}

	exports.MiniAccelerator = MiniAccelerator;
	exports.MiniAdpter = MiniAdpter;
	exports.MiniFileMgr = MiniFileMgr;
	exports.MiniImage = MiniImage;
	exports.MiniInput = MiniInput;
	exports.MiniLoader = MiniLoader;
	exports.MiniLocalStorage = MiniLocalStorage;
	exports.MiniLocation = MiniLocation;
	exports.MiniSound = MiniSound;
	exports.MiniSoundChannel = MiniSoundChannel;
	exports.MiniVideo = MiniVideo;

} 
