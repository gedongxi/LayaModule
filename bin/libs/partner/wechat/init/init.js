require("m4.js");
require("webglUtil.js");

//version-api-begin
window.__DY_VERSION_API="https://xyx-ver02.dayukeji.com/arrow/wechat/rel/191115/index.php";
//version-api-end


var TEX_FILE_BG  = "libs/partner/wechat/init/loading.jpg";
var TEX_FILE_TIP = "libs/partner/wechat/init/tip.jpg";

var isSubpackLoaded      = false; // 是否成功加载子包
var isFirstFrameRendered = false; // 是否已经渲染了第一帧
var isReceivedVersion    = false;

var systemInfo = wx.getSystemInfoSync();
var isIOS      = (systemInfo.platform === "ios");
var pixelRatio = systemInfo.pixelRatio;
var isWebgl    = false;
var aniId      = 0;
var canvas     = wx.__DY_CANVAS;
var gl         = canvas.getContext('webgl');

window.__DY_WINDOW_HEIGHT = systemInfo.windowHeight * pixelRatio;
window.__DY_WINDOW_WIDTH  = systemInfo.windowWidth  * pixelRatio;





var textureInfos  = [];
var drawInfos     = [];
var frameCount    = 0;
var canvasW       = 0;
var canvasH       = 0;

// 判断当前是否支持webgl
if (gl) {
  isWebgl = true;
  if (isIOS) {
    canvasW = gl.canvas.height * pixelRatio;
    canvasH = gl.canvas.width * pixelRatio;
    gl.canvas.width = canvasW;
    gl.canvas.height = canvasH;
  } else {
    canvasW = gl.canvas.width;
    canvasH = gl.canvas.height;
  }
}

var scale = canvasH / 720;


var glProgram           = null;
var glPositionBuffer    = null;
var glTexcoordBuffer    = null;
var glPositionLocation  = null;
var glTexcoordLocation  = null;
var glMatrixLocation    = null;
var glTextureLocation   = null;

/*
 * 逻辑相关
 */
var init = function () {
    var vertexShader = "attribute vec4 a_position; attribute vec2 a_texcoord; uniform mat4 u_matrix; varying vec2 v_texcoord; void main() {gl_Position = u_matrix * a_position; v_texcoord = a_texcoord;}";
    var fragShader   = "precision mediump float; varying vec2 v_texcoord; uniform sampler2D u_texture; void main() {gl_FragColor = texture2D(u_texture, v_texcoord); if(gl_FragColor.a < 0.5) {discard;}}";

  
    glProgram = webglUtils.createProgramFromSources(gl, [vertexShader, fragShader]);
    gl.useProgram(glProgram);
    glPositionLocation  = gl.getAttribLocation(glProgram,  "a_position");
    glTexcoordLocation  = gl.getAttribLocation(glProgram,  "a_texcoord");
    glMatrixLocation    = gl.getUniformLocation(glProgram, "u_matrix");
    glTextureLocation   = gl.getUniformLocation(glProgram, "u_texture");
    glPositionBuffer    = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, glPositionBuffer);


    // Put a unit quad in the buffer
    var positions = [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    glTexcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, glTexcoordBuffer);
    // Put texcoords in the buffer
    var texcoords = [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);


    var bgTexInfo  = loadImageAndCreateTextureInfo(TEX_FILE_BG,  canvasW / 2, canvasH / 2,  1, true);
    //var tipTexInfo = loadImageAndCreateTextureInfo(TEX_FILE_TIP, canvasW / 2, canvasH - 20, 2, true);

    textureInfos.push(bgTexInfo);
    //textureInfos.push(tipTexInfo);

    startRender();

    // 如果没有子包 则直接设置标记
    if (!window.__DY_SUBPACK_FLAG) {
        isSubpackLoaded = true;
    } else {
        // 开始加载子包
        loadSubpackage();
    }

    // 获取获取版本信息
    if (window.__DY_VERSION_API) {
        wx.request({
            url: window.__DY_VERSION_API,
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "GET",
            data: { "time": new Date().getTime() },
            success: function(res) {
                // 当前版本的状态
                if (res.data && res.data.version_status) {
                    window.__DY_VERSION_STATUS = res.data.version_status;
                }
                isReceivedVersion = true;
            },
            fail: function(res) {
                isReceivedVersion = true;
            }
        });
    } else {
        isReceivedVersion = true;
    }
}

var loadImageAndCreateTextureInfo = function (url, dstX, dstY, order, isAutoDraw) {
  /*
  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,     gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,     gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  */

  var textureInfo = {
    width:    0,
    height:   0,
    texture:  null,
    url:      url,
    order:    order
  };

  var img = new Image();
  img.addEventListener('load', function () {
    textureInfo.width  = img.width  * scale;
    textureInfo.height = img.height * scale;
  
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D,    0, gl.RGBA, gl.RGBA,   gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,     gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,     gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    textureInfo.texture = tex;

    if (!isAutoDraw) {
      return;
    }

    var drawInfo = {
      x: dstX - textureInfo.width  / 2,
      y: dstY - textureInfo.height / 2,
      textureInfo: textureInfo
    };
    drawInfos.push(drawInfo);

    drawInfos.sort(function (a, b) {
      return a.textureInfo.order - b.textureInfo.order;
    });
  });

  img.src = url;
  return textureInfo;
}

var loadSubpackage = function() {
  // 到正式上线的时候这里只会加载一个子包 res
  // 目前测试阶段为了和弓箭手逻辑差不多，所有的子包都放在这里加载
  var subList = ["res", "sub1", "sub2"];
  var finishCallback = function(sub) {
    var idx = subList.indexOf(sub);
    if (idx < 0) {
      return;
    }
    subList.splice(idx, 1);
    if (subList.length === 0) {
      isSubpackLoaded = true;
    }
  }
  doLoadSubpackage("res",  finishCallback);
  doLoadSubpackage("sub1", finishCallback);
  doLoadSubpackage("sub2", finishCallback);
}

// 加载子包
var doLoadSubpackage = function (subName, finishCallback) {
  wx.loadSubpackage({
    name: subName,
    success: function (res) {
      finishCallback(subName);
    },
    fail: function (res) {
      setTimeout(function () { doLoadSubpackage(subName, finishCallback); }, 1000);
    }
  });
}


// 目前没有需要更新的
var update = function () {
  frameCount++;
  if (frameCount > 20) {
    frameCount = 0;
  }
}

var draw = function () {
  if (!isWebgl) {
    return;
  }

  //gl.viewport(0, 0, canvasW, canvasH);
  gl.clearColor(0, 0, 0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  drawInfos.forEach(function (drawInfo) {
    var textureInfo = drawInfo.textureInfo;
    if (textureInfo.texture) {
      drawImage(textureInfo.texture, textureInfo.width, textureInfo.height, drawInfo.x, drawInfo.y);
    }
  });

  if (!isFirstFrameRendered && drawInfos.length > 0) {
    isFirstFrameRendered = true;
  }
}

var drawImage = function (tex, texWidth, texHeight, dstX, dstY) {
  gl.bindTexture(gl.TEXTURE_2D, tex);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, glPositionBuffer);
  gl.enableVertexAttribArray(glPositionLocation);
  gl.vertexAttribPointer(glPositionLocation, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, glTexcoordBuffer);
  gl.enableVertexAttribArray(glTexcoordLocation);
  gl.vertexAttribPointer(glTexcoordLocation, 2, gl.FLOAT, false, 0, 0);
  
  var matrix = m4.orthographic(0, canvasW, canvasH, 0, -1, 1);
  matrix     = m4.translate(matrix, dstX, dstY, 0);
  matrix     = m4.scale(matrix, texWidth, texHeight, 1);

  gl.uniformMatrix4fv(glMatrixLocation, false, matrix);
  gl.uniform1i(glTextureLocation, 0);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}


var stopRender = function () {
  window.cancelAnimationFrame(aniId);
}


var startRender = function () {
  window.cancelAnimationFrame(aniId);
  aniId = window.requestAnimationFrame(render, canvas)
}



var render = function () {
  update();
  draw();

  //aniId = window.requestAnimationFrame(render, canvas);
  //return;

  // 如果第一帧 已经渲染 并且子包也加载完毕了
  if (isFirstFrameRendered && isSubpackLoaded && isSubpackLoaded) {
    //stopRender();
    setTimeout(function() {
        wx.hideLoading();
    }, 500);

    loadLib("index.js");
  } else {
    aniId = window.requestAnimationFrame(render, canvas);
  }
}


setTimeout(function() {
    wx.showLoading({
        title: "正在初始化..."
    });
}, 500);


// 进行初始化
init();
