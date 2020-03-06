/******************************
 * 显示层面
 *****************************/
 // 战斗状态
export enum EFightStatus {
  FightNone      = 0,          // 空
  FightPre       = 1,          // 战斗前
  FightIng       = 2,          // 战斗中
  FightEnd       = 3,          // 战斗结束
  FightOvertime  = 4,           // 平局 加时战斗
}
 
// ui层级
export enum EAreanUIZOrder {
  ZOrder1     = 1,    // 背景
  ZOrder2     = 2,    // 人物之后的特效，比如大招时的黑屏等
  ZOrder3     = 3,    // 脚底光圈等
  ZOrder4     = 4,    // 人物
  ZOrder5     = 5,    // 投掷物、子弹等
  ZOrder6     = 6,    // 受击效果等
}

// 玩家特效
export enum EPlayerEffect {
  LineDirection     = "aim_eff@direction",
  Sector            = "aim_eff@sector-red",
  Parabola          = "aim_eff@madrat_line",
  RoleTeamSelf      = "role_eff@team_player",
  RoleTeamMate      = "role_eff@teammate",
  RoleTeamEnemy     = "role_eff@team_purple",
  MoveDot           = "role_eff@dot",
  SkillRange        = "role_eff@team_yellow",

}

// 人物动画
export enum ERoleAnimName {
  Idle      = "idle",
  Run       = "run",
  Attack    = "attack",
  Dead      = "dead",
}

// 玩家阵营
export enum ECampType {
  Camp1      = 1, // 第一阵营
  Camp2      = 2, // 第二阵营
}

// 玩家类型
export enum EPlayerType {
  Self       = 1, // 自己
  Mate       = 2, // 队友
  Enemy      = 3, // 敌人
}

// 伤害飘血颜色
export enum EHurtColor {
  White     = 1, // 敌人被自己打
  Red       = 2, // 自己被打
}
