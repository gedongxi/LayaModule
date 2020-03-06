import { PPlayer, PSynInit } from "../proto/ProtoType";
import EventUtil from "../event/EventUtil";
import { Events } from "../event/Event";
import Misc from "../commonUnit/Misc";

interface IId2Player {
  [id: number]: PSynInit;
}

// 玩家的数据
export default class DataPlayer {
  public static get INSTANCE(): DataPlayer {
    if (!DataPlayer.singleInstace) {
      DataPlayer.singleInstace = new DataPlayer();
    }
    return DataPlayer.singleInstace;
  }
  private static singleInstace: DataPlayer;

  // 玩家id
  private mNumID: number = 0;

  // 玩家等级
  private mNumPlayerLv: number = 0;

  // 玩家武器id
  private mNumWeaponId: number = 0;

  // 玩家武器等级
  private mNumWeaponLvl: number = 1;

  // 临时 tank形象id
  private mNumBottomId: number = 1;

  public constructor() {
  }

  // 玩家id
  public set PlayerId(id: number) {
    Misc.myLog("##########################自己id", id);
    this.mNumID = id;
  }
  public get PlayerId(): number {
    return this.mNumID;
  }

  // 玩家id
  public set PlayerLv(pNumLv: number) {
    this.mNumPlayerLv = pNumLv;
  }

  public get PlayerLv(): number {
    return this.mNumPlayerLv;
  }

  // 玩家武器
  public set WeaponId(pNumWeaponId: number) {
    this.mNumWeaponId = pNumWeaponId;
  }
  
  public get WeaponId(): number {
    return this.mNumWeaponId;
  }

  // 玩家武器等级
  public set WeaponLvl(pNumWeaponLvl: number) {
    this.mNumWeaponLvl = pNumWeaponLvl;
  }
  
  public get WeaponLvl(): number {
    return this.mNumWeaponLvl;
  }

  // 玩家底部形象id
  public set TankBottomId(pNumBottomId: number) {
    this.mNumBottomId = pNumBottomId;
  }
  
  public get TankBottomId(): number {
    return this.mNumBottomId;
  }
}
