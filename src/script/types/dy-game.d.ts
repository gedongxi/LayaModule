
// 这部分的实现在game_ext.js中
    
export namespace DyGame {
  function $error(code: number, ...params:any[]):void;

  class MixStringBuffer {
    constructor();
    setOri(ori: string);
    toString(): string;
  }
  
}

export type DyGame_ = typeof DyGame;
declare global {
  const DyGame: DyGame_;
  const GEM_RES_REMOTE_SERVER_ROOT: string;
}
