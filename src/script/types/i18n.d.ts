declare module i18n {
  let uiText: any;
  let uiData: any;               // ui文本内容的数据
  let sysData: any;               // 配置中文本内容的数据
  let locale: string;           // 当前使用的语言
  function  ui(key: string): string;      // 获取ui或者代码中文字内容
  function sys(key: string): string;      // 获取配置中的文本内容
}
