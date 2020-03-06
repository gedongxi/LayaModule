if ((typeof swan !== 'undefined') && (typeof swanGlobal !== 'undefined')) {
	require("swan-game-adapter.js");
	require("libs/laya.bdmini.js");
} else if (typeof wx!=="undefined") {
	require("weapp-adapter.js");
	require("libs/laya.wxmini.js");
	window.__DY_IS_WECHAT = true;
	require("libs/partner/wechat/included.js");
}


window.loadLib = require;

//--subpack-flag--begin
// 是否使用了子包的标志
window.__DY_SUBPACK_FLAG = false;
//--subpack-flag--end


if (window.__DY_IS_WECHAT) {
	loadLib("libs/partner/wechat/init/init.js");
} else {
	require("index.js");
}