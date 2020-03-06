## 《Tank项目》对laya引擎的修改记录
### ================================================
### 示例一
#### by Jingkun

> laya.wxmini.js 基本完全重写
```
laya.wxmini.js
```

> laya.core.js 
```
原来laya引擎对文件url和实际文件下载地址没有进行分离，这样对资源混淆处理特别不方便，
基于上面对 laya.wxmini.js的修改，所以引入了fileUrl这个变量作为文件的实际下载地址

_loadHtmlImage(url, onLoadCaller, onLoad, onErrorCaller, onError) {
    ...
    //CHANGE by Jingkun 把url和实际资源地址进行分离
    //image.src = url;
    image.src = this.fileUrl ? this.fileUrl : Laya.URL.calcRealUrl(url, true);
    Loader._imgCache[url] = image;
}
```

### ================================================
### 动画事件监听修改
#### by 宋倩倩
>laya.d3.js
```
play(name = null, layerIndex = 0, normalizedTime = Number.NEGATIVE_INFINITY) {
    ...
    //CHANGE by sqq 添加动画被切换的中断事件 （解决由循环播放动画切换其他动画时 不执行onStateExit()）
    // 添加一下代码
    if (curPlayState !== animatorState && curPlayState !== null && !finish) {
        // 上一个状态被中断
        var scripts1 = curPlayState._scripts;
        if (scripts1) {
            for (var i = 0, n = scripts1.length; i < n; i++)
                scripts1[i].onStateInterrupt();
        }
    }
    ...
}
```