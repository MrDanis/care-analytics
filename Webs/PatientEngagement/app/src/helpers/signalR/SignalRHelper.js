/* istanbul ignore file */

export class SignalRHelper {
  constructor() {}

  signalRStatus: false;

  // Singleton Class
  static _instance: SignalRHelper = null;
  static sharedInstance() {
    if (this._instance === null) {
      this._instance = new SignalRHelper();
    }
    return this._instance;
  }
}
