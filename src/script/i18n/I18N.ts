export default class I18N {

  // 获取UI文本
  public static getUIText(languageKey: string): string {
    return i18n.ui(languageKey);
  }

  // 获取配置文本
  public static getSysText(languageId: number): string {
    const key = "" + languageId;
    return i18n.sys(key);
  }
}
