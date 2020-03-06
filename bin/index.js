/**
 * 设置LayaNative屏幕方向，可设置以下值
 * landscape           横屏
 * portrait            竖屏
 * sensor_landscape    横屏(双方向)
 * sensor_portrait     竖屏(双方向)
 */
window.screenOrientation = "sensor_landscape";


//===log-level-begin===
window.console_log_level = 0;
//===log-level-end===

if(!window.console) { window.console = {};}
var emptyLog = function(){};
(window.console_log_level > 4) && (console["error"]  = emptyLog, false);
(window.console_log_level > 3) && (console["warn"]   = emptyLog, false);
(window.console_log_level > 2) && (console["info"]   = emptyLog, false);
(window.console_log_level > 1) && (console["debug"]  = emptyLog, false);
(window.console_log_level > 1) && (console["log"]    = emptyLog, false);


// 在此处插入mapping列表
//--insert-mapping--begin
//--insert-mapping--end

// 加上这个埋点
//-----loadLib-begin------


//-----libs-begin-----
loadLib("libs/laya.core.js")
loadLib("libs/laya.ui.js")
loadLib("libs/laya.d3.js")
loadLib("libs/game_ext.js")
loadLib("libs/i18n.js")
loadLib("libs/partner.js")
//-----libs-end-------

//===js-bundle-begin===

loadLib("js/bundle.js");

//===js-bundle-end===


//-----loadLib-end------