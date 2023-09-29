import {SessionManager} from 'react-native-google-cast';
export class GoogleCastHelper {
  // Class Variables
  static instance = null;

  // member variables
  manager = null;
  session = null;
  client = null;
  connectedDevice = null;
  deviceChangedCallBack = null;

  static getInstance() {
    if (!GoogleCastHelper.instance) {
      GoogleCastHelper.instance = new GoogleCastHelper();
    }
    return GoogleCastHelper.instance;
  }

  constructor() {
    this.manager = new SessionManager();
    console.log('Manager:', this.manager);
    this.manager.getCurrentCastSession().then(castSession => {
      console.log('Cast Session:', castSession);
      this.session = castSession;
      this.client = castSession.getClient();
      this.session.getCastDevice().then(device => {
        this.connectedDevice = device;
      });
    });

    // Listeners
    this.startedListener = this.manager.onSessionStarted(session => {
      // this.setState({client: session.client}),
      console.log('onSessionStarted');
      this.session = session;
      this.processSession();
    });
    this.resumedListener = this.manager.onSessionResumed(session => {
      console.log('onSessionResumed');
      this.session = session;
      this.processSession();
    });
    this.suspendedListener = this.manager.onSessionSuspended(session => {
      console.log('onSessionSuspended');
      this.session = null;
      this.processSession();
    });
    this.endingListener = this.manager.onSessionEnding(session => {
      console.log('onSessionEnding');
      this.session = null;
      this.processSession();
    });
  }

  processSession() {
    if (this.session) {
      this.client = this.session.client;
      this.session.getCastDevice().then(device => {
        this.connectedDevice = device;
        this.deviceChangedCallBack(this.connectedDevice);
      });
    } else {
      this.client = undefined;
      this.connectedDevice = undefined;
      this.deviceChangedCallBack(null);
    }
  }

  onDeviceChanged(callBack) {
    console.log('CallBackSet');
    this.deviceChangedCallBack = callBack;
  }

  castMedia(): boolean {
    console.log('Cast media initiated');
    if (this.client) {
      console.log('Ready');
      this.client.loadMedia({
        autoplay: true,
        mediaInfo: {
          contentUrl:
            'https://dl.dropboxusercontent.com/s/03enbwuc8e441x8/reminder.mp3',
        },
      });
    }
  }
}
