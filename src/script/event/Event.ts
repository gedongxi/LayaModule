

export enum Events {

    /**
     * 通用Common
     */

    // 程序进入后台
    EVENT_APP_ON_HIDE                    = "event_app_background",

    // 程序进入前台
    EVENT_APP_ON_SHOW                    = "event_app_show",

    // 通知netwatcher重连
    EVENT_RECONNECT                      = "event_reconnect",

    // 收到服务器时间
    EVENT_SERVER_TIME                    = "event_server_time",

    // 开始同步服务器时间
    EVENT_START_SYNC_TIME                = "event_start_sync_time",

    // 协议错误
    EVENT_PROTO_DEBUG                    = "event_proto_debug",

    // 请求服务器时间
    EVENT_SEND_SERVER_TIME               = "event_send_server_time",

    // // 适配
    // EVENT_STAGE_RESIZE                   = "event_stage_resize",


    /**
     * LoginScene
     */
    
    // 成功登录
    EVENT_LOGIN_SUCCESS                     = "event_login_success",

    // 服务器返回确认成功进入游戏
    EVENT_LOGIN_SURE_ENTER_GAME             = "event_login_sure_enter_game",

    // 服务器返回创建角色的结果
    EVENT_LOGIN_CREATE_ROLE_BACK            = "event_login_create_role_back",

    // 正常登录返回
    EVENT_LOGIN_NORMAL_BACK                 = "event_login_normal_back",

    // 重新登录返回
    EVENT_LOGIN_RELOGIN_BACK                = "event_login_relogin_back",

    // 是否要显示输入框
    EVENT_LOGIN_SHOW_TEXTINPUT              = "event_show_textinput",

    // 在选服界面切换服务器
    EVENT_LOGIN_SWITCH_SERVER               = "event_login_switch_server",  


    /**
     * MainScene
     */

     // 房间

     // 进入房间通知
     EVENT_MAIN_ENTER_NOTIFY                = "event_main_enter_notify",
     // 更新房间内玩家数量
     EVENT_MAIN_ROOM_UPDATE_COUNT           = "event_main_room_update_count",
     // 生成机器人返回
     EVENT_MAIN_ROOM_MAKE_ROBOT             = "event_main_room_make_robot",
     // 选择武器返回
     EVENT_MAIN_SELECT_WEAPON_BACK          = "event_main_select_weapon_back",



    /**
     * FightScene
     */

     // 通知map，添加child节点到infoNode
    EVENT_ADD_CHILD_TO_INFO_NODE      = "event_add_child_to_info_node",

    // 通知map，添加child节点到roleLayer
    EVENT_ADD_CHILD_TO_ROLELAYER      = "event_add_child_to_rolelayer",

    // 通知map，添加child节点到missilelayer
    EVENT_ADD_CHILD_TO_MISSILELAYER   = "event_add_child_to_missilelayer",

    // fight 场景预加载结束
    EVENT_FIGHT_PRELOAD_FINISH        = "event_fight_preload_finish",

    // 开始游戏通知
    EVENT_FIGHT_START_GAME            = "event_fight_start_game",

    // 服务器的逻辑帧数据更新
    EVENT_FIGHT_LS_FRAME_DATA         = "event_fight_ls_frame_data", 

    // 竞技场关闭
    EVENT_FIGHT_ARENA_CLOSE           = "event_fight_arena_close",

    // 准备完毕 开始游戏
    EVENT_FIGHT_START_BATTLE          = "event_fight_start_battle",

    // 草丛相关
    // 草丛透明
    EVENT_GRASS_DO_TRANSPARENT          = "event_grass_do_transparent",

    // 草丛不透明
    EVENT_GRASS_CANCEL_TRANSPARENT      = "event_grass_cancel_transparent",

    // 草丛隐藏
    EVENT_GRASS_HIDE                    = "event_grass_hide",

    // 草丛出现
    EVENT_GRASS_SHOW                    = "event_grass_show",

    // 墙相关
    // 墙隐藏
    EVENT_WALL_HIDE                     = "event_wall_hide",

    // 墙出现
    EVENT_WALL_SHOW                     = "event_wall_show",

    // 特效相关
    // 普攻特效角度变化
    EVENT_AIM_EFFECT_CHANGE_ROTATE      = "event_aim_effect_change_rotate",

    // 玩家自身的矩阵发生变化
    EVENT_MYSELF_TRANSFORM_CHANGED      = "event_self_transform_changed",

    // 自己死亡
    EVENT_PLAYER_SLEF_DIE               = "event_player_slef_die",

    // 自己重生
    EVENT_PLAYER_SLEF_REBORN            = "event_player_slef_reborn",

    // 通知skill面板伤害值改变
    EVENT_SKILL_CHARGE_DAMAGE_UPDATE    = "event_skill_charge_damage_update",
}
