import * as ProtoDebug from "./mods/ProtoSectionDebug";
import * as ProtoAcc from "./mods/ProtoSectionAcc";
import * as ProtoPlayer from "./mods/ProtoSectionPlayer";
import * as ProtoRoom from "./mods/ProtoSectionRoom";
import * as ProtoMap from "./mods/ProtoSectionMap";
import * as ProtoCard from "./mods/ProtoSectionCard";
import * as ProtoMatch from "./mods/ProtoSectionMatch";
import * as ProtoWeapon from "./mods/ProtoSectionWeapon";

export enum ProtoSection {

    debug = 9,
    acc = 10,
    player = 11,
    room = 20,
    map = 21,
    card = 22,
    match = 23,
    weapon = 24,
}

export const ProtoMsgMap = {

    2304 : ProtoDebug.DebugErrorS2C,
    2560 : ProtoAcc.AccLoginS2C,
    2562 : ProtoAcc.AccCreateS2C,
    2564 : ProtoAcc.AccEnterS2C,
    2565 : ProtoAcc.AccKickOfflineS2C,
    2566 : ProtoAcc.AccReloginS2C,
    2567 : ProtoAcc.AccServertimeS2C,
    2570 : ProtoAcc.AccBanS2C,
    2571 : ProtoAcc.AccMaintainS2C,
    2816 : ProtoPlayer.PlayerSelfInfoS2C,
    2817 : ProtoPlayer.PlayerFortuneS2C,
    2818 : ProtoPlayer.PlayerDailyClearedS2C,
    2819 : ProtoPlayer.PlayerAnnouncementS2C,
    5122 : ProtoRoom.RoomEnterNotifyS2C,
    5123 : ProtoRoom.RoomUpdateCountS2C,
    5125 : ProtoRoom.RoomMakeRobotS2C,
    5376 : ProtoMap.MapStartNotifyS2C,
    5377 : ProtoMap.MapSynS2C,
    5478 : ProtoMap.MapCloseArenaS2C,
    5379 : ProtoMap.MapChooseSkillS2C,
    5580 : ProtoMap.MapGoUpgradeS2C,
    5380 : ProtoMap.MapUpgradeS2C,
    5383 : ProtoMap.MapReloginFrameS2C,
    5384 : ProtoMap.MapReloginDoneS2C,
    5385 : ProtoMap.MapPlayerInMapS2C,
    5387 : ProtoMap.MapEnterS2C,
    5388 : ProtoMap.MapRefreshSkillS2C,
    5390 : ProtoMap.MapStartBattleS2C,
    5476 : ProtoMap.MapGmAddSkillS2C,
    5633 : ProtoCard.CardOwnedS2C,
    5634 : ProtoCard.CardGroupS2C,
    5635 : ProtoCard.CardSwapS2C,
    5636 : ProtoCard.CardEquipS2C,
    5637 : ProtoCard.CardSetGroupNameS2C,
    5638 : ProtoCard.CardSetGroupOnS2C,
    5889 : ProtoMatch.MatchCancelMatchS2C,
    5890 : ProtoMatch.MatchMatchedSumS2C,
    5891 : ProtoMatch.MatchPlayerInMatchS2C,
    6145 : ProtoWeapon.WeaponSelectWeaponS2C,
    6146 : ProtoWeapon.WeaponWeaponInfoS2C,
    6147 : ProtoWeapon.WeaponCarInfoS2C,
    6148 : ProtoWeapon.WeaponSlotInfoS2C,
    6149 : ProtoWeapon.WeaponGetWeaponS2C,
    6150 : ProtoWeapon.WeaponGetCarS2C,
    6151 : ProtoWeapon.WeaponGetSlotS2C,
    6152 : ProtoWeapon.WeaponUpgradeWeaponS2C,
    6153 : ProtoWeapon.WeaponUpgradeCarS2C,
    6154 : ProtoWeapon.WeaponUpdateSlotS2C,
};

export enum ProtoErrorCode {

    "成功" = 0,
    "未知错误" = 1,
    "失败" = 5,
    "系统错误" = 1000,
    "数据库错误" = 1001,
    "对象不存在" = 1003,
    "参数错误" = 1004,
    "请求超时" = 1008,
    "认证失败" = 1100,
    "维护状态" = 1101,
    "需要重新登陆" = 1102,
    "内容包含非法信息或长度不合适" = 1105,
    "名称已存在" = 1106,
    "玩家不存在" = 1108,
    "金币不足" = 1201,
    "宝石不足" = 1211,
    "对应目标不存在" = 1503,
    "玩家不存在或者离线" = 1601,
    "房间不存在" = 2001,
    "不是房主" = 2002,
    "卡组不存在" = 2201,
    "卡牌未拥有" = 2202,
    "缺乏物品" = 2300,
    "未拥有武器" = 2301,
    "缺乏材料" = 2302,
}
