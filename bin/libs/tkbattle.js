(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.TankBattle = {}));
}(this, (function (exports) { 'use strict';

    var tkVec2 = /** @class */ (function () {
        function tkVec2() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this.data = new Float32Array([1, 0, 0, 1]);
            if (args[0] instanceof Float32Array) {
                if (args[0].length !== 2) {
                    throw new Error();
                }
                this.data = args[0];
            }
            else {
                var x = typeof args[0] === "number" ? args[0] : 0;
                var y = typeof args[1] === "number" ? args[1] : 0;
                this.data = new Float32Array([x, y]);
            }
        }
        Object.defineProperty(tkVec2.prototype, "x", {
            get: function () {
                return this.data[0];
            },
            set: function (value) {
                this.data[0] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(tkVec2.prototype, "y", {
            get: function () {
                return this.data[1];
            },
            set: function (value) {
                this.data[1] = value;
            },
            enumerable: true,
            configurable: true
        });
        tkVec2.prototype.Clone = function () {
            return new tkVec2(this.x, this.y);
        };
        return tkVec2;
    }());

    var tkArena = /** @class */ (function () {
        function tkArena() {
        }
        tkArena.prototype.sayHello = function () {
            console.log("######hello world!");
        };
        return tkArena;
    }());

    exports.tkArena = tkArena;
    exports.tkVec2 = tkVec2;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
