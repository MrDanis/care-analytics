import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  GraphRequest,
  LoginManager,
  AccessToken,
  GraphRequestManager,
} from 'react-native-fbsdk-next';

export async function loginWithGoogle() {
  await GoogleSignin.hasPlayServices();
  // await GoogleSignin.revokeAccess();
  // await GoogleSignin.signOut();
  console.log('reached google sign in');
  return new Promise((resolve, reject) => {
    //         scopes: ['https://www.googleapis.com/auth/calendar'],
    try {
      //GoogleSignin.configure();
      GoogleSignin.configure({
        webClientId:
          '726634767999-33eg7ichbi76s40da30ia1cun283sc3r.apps.googleusercontent.com',
        offlineAccess: true,
        forceCodeForRefreshToken: true,
        forceConsentPrompt: true,
        
      });
      const userInfo = GoogleSignin.signIn();
      console.log(userInfo);
      userInfo ? resolve(userInfo) : reject(false);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('user cancelled the login flow');
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('operation (e.g. sign in) is in progress already');
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('play services not available or outdated');
        // play services not available or outdated
      } else {
        console.log('some other error happened');
        // some other error happened
        console.log(error);
      }
    }
  });
}
export function getInfoFromToken(token) {
  return new Promise((resolve, reject) => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: 'id,name,first_name,last_name,email,birthday,about',
      },
    };
    const profileRequest = new GraphRequest(
      '/me',
      {token, parameters: PROFILE_REQUEST_PARAMS},
      (error, user) => {
        if (error) {
          console.log('login info has error: ' + error);
        } else {
          user ? resolve(user) : reject(false);
        }
      },
    );
    new GraphRequestManager().addRequest(profileRequest).start();
  });
}
export function loginWithFacebookID() {
  return new Promise((resolve, reject) => {
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      login => {
        if (login.isCancelled) {
          console.log('Login cancelled');
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            const accessToken = data.accessToken.toString();
            console.log('facebook access token');
            console.log(accessToken);
            accessToken ? resolve(accessToken) : reject(false);
            // getInfoFromToken(accessToken).then(user => {
            //   user ? resolve(user) : reject(false);
            // });
          });
        }
      },
      error => {
        console.log('Login fail with error: ' + error);
      },
    );
  });
  // Attempt a login using the Facebook login dialog asking for default permissions.
}
export const signOut = async () => {
  console.log('====================================');
  console.log('here');
  console.log('====================================');
  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
  } catch (error) {
    console.log('google error');
    console.error(error);
  }
};
export const FBLogout = accessToken => {
  AccessToken.getCurrentAccessToken().then(data => {
    console.log('data');
    console.log(data);
    const accessToken = data.accessToken.toString();
    let logout = new GraphRequest(
      'me/permissions/',
      {
        accessToken: accessToken,
        httpMethod: 'DELETE',
      },
      (error, result) => {
        if (error) {
          console.log('Error fetching data: ' + error.toString());
        } else {
          console.log('logout successfully');
          LoginManager.logOut();
        }
      },
    );
    new GraphRequestManager().addRequest(logout).start();
  });
};
