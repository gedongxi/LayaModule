import EventDispatcher = Laya.EventDispatcher;

const DispatcherList: EventDispatcher[] = [];

export const DebugDispatcher: EventDispatcher = new EventDispatcher();
DispatcherList[9] = DebugDispatcher;
export const AccDispatcher: EventDispatcher = new EventDispatcher();
DispatcherList[10] = AccDispatcher;
export const PlayerDispatcher: EventDispatcher = new EventDispatcher();
DispatcherList[11] = PlayerDispatcher;
export const RoomDispatcher: EventDispatcher = new EventDispatcher();
DispatcherList[20] = RoomDispatcher;
export const MapDispatcher: EventDispatcher = new EventDispatcher();
DispatcherList[21] = MapDispatcher;
export const CardDispatcher: EventDispatcher = new EventDispatcher();
DispatcherList[22] = CardDispatcher;
export const MatchDispatcher: EventDispatcher = new EventDispatcher();
DispatcherList[23] = MatchDispatcher;
export const WeaponDispatcher: EventDispatcher = new EventDispatcher();
DispatcherList[24] = WeaponDispatcher;


export { DispatcherList };
