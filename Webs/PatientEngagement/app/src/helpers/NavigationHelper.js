/* istanbul ignore file */

export class NavigationHelper {
  constructor() {}

  navigation: null;
  signalRStatus: false;
  loaderCallBack = null;
  totalCallDuration = 0;

  // Singleton Class
  static _instance: NavigationHelper = null;
  static sharedInstance() {
    if (this._instance === null) {
      this._instance = new NavigationHelper();
    }
    return this._instance;
  }
  hideLoader = () => {
    if (this.loaderCallBack !== null) {
      this.loaderCallBack();
    }
  };
}
