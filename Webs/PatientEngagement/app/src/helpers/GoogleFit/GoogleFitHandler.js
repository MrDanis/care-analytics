/* istanbul ignore file */
import GoogleFit, {Scopes} from 'react-native-google-fit';
import {Alert, Linking} from 'react-native';
export const checkGoogleFitAppInstalled = async () => {
  return new Promise((resolve, reject) => {
    GoogleFit.isAvailable(res => {
      console.log('come here');
      console.log(res);
      if (res) {
        // startGoogleFit();
        console.log('come here true after pressing yess or no');
        res ? resolve(res) : reject(false);
      } else {
        showAlert();
      }
    });
  });
};
function showAlert() {
  Alert.alert(
    'GoogleFit',
    'Please Install GoogleFit From Play Store',
    [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
      },
      {
        text: 'Already Installed',
        onPress: () => startGoogleFit()
      },
      {
        text: 'OK',
        onPress: () => {
          console.log('OK Pressed');
          Linking.openURL(
            'https://play.google.com/store/apps/details?id=com.google.android.apps.fitness',
          ).catch(err => console.error('An error occurred', err));
        },
      },
    ],
    {cancelable: false},
  );
}

export function startGoogleFit() {
  console.log('Calling the google fit for starting')
  const options = {
    scopes: [
      Scopes.FITNESS_ACTIVITY_READ_WRITE,
      Scopes.FITNESS_BODY_READ_WRITE,
    ],
  };
  console.log('options are taken');
  GoogleFit.authorize(options)
    .then(authResult => {
      if (authResult.success) {
        console.log('AUTH_SUCCESS');
        console.log('Call form the android to get the data : ',authResult);
        // getTodaySteps();
      } else {
        console.log('AUTH_DENIED', authResult.message);
      }
    })
    .catch(() => {
      console.log('AUTH_ERROR');
    });
}
const startDate = () => {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d.toISOString();
};

const endDate = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 2);
  return now.toISOString();
};

export const checkIsAuthorized = async () => {
  return new Promise((resolve, reject) => {
    const opt = {
      unit: 'kg', // required; default 'kg'
      startDate: startDate(), // required
      endDate: endDate(), // required
      ascending: false, // optional; default false
    };
    GoogleFit.getWeightSamples(opt, (err, res) => {
      res ? resolve(res) : reject(false);
    });
  });
};
export const getTodaySteps = async () => {
 
  console.log('I am called for the google fit ');
  return new Promise((resolve, reject) => {
    const options = {
      scopes: [Scopes.FITNESS_ACTIVITY_READ,Scopes.FITNESS_ACTIVITY_WRITE, Scopes.FITNESS_BODY_READ,Scopes.FITNESS_BODY_WRITE],
    };
    GoogleFit.authorize(options)
      .then(authResult => {
        console.log('Result form the google fit is : ',authResult);
        if (authResult.success) {
          console.log('AUTH_SUCCESS');
          const opt = {
            startDate: startDate(), // required ISO8601Timestamp
            endDate: endDate(), // required ISO8601Timestamp
            bucketUnit: 'DAY', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
            bucketInterval: 1, // optional - default 1.
          };
          console.log('Call for getting the steps....');
          GoogleFit.getDailySteps(new Date().toISOString())
            .then(res => {
              res ? resolve({res,auth:true}) : reject(false);
              console.log('Daily steps 123 form the google fit is >>> ', JSON.stringify(res));
            })
            .catch(err => {
              console.log('Daily steps456 >>> ', err);
            });
          // GoogleFit.getDailyStepCountSamples(opt)
          //   .then(res => {
          //     console.log('Daily steps >>> ', res);
          //     res ? resolve(res) : reject(false);
          //   })
          //   .catch(err => {
          //     console.log('Daily steps >>> ', err);
          //   });
        } else {
          console.log('AUTH_DENIED', authResult.message);
        }
      })
      .catch(() => {
        console.log('AUTH_ERROR');
      });
  });
};
export const getTodayActivities = async () => {
  return new Promise((resolve, reject) => {
    const options = {
      scopes: [
        Scopes.FITNESS_ACTIVITY_READ,
        Scopes.FITNESS_BODY_READ,
        Scopes.FITNESS_LOCATION_READ,
      ],
    };
    GoogleFit.authorize(options)
      .then(authResult => {
        if (authResult.success) {
          console.log('AUTH_SUCCESS');
          let opt = {
            startDate: startDate(), // required
            endDate: endDate(), // required
            bucketUnit: 'MINUTE', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
            bucketInterval: 15, // optional - default 1.
          };

          GoogleFit.getActivitySamples(opt)
            .then(res => {
              console.log('getActivitySamples');
              console.log(res);
              res ? resolve(res) : reject(false);
            })
            .catch(err => {
              console.log('activity error');
              console.log(err);
            });
          // GoogleFit.getDailyStepCountSamples(opt)
          //   .then(res => {
          //     console.log('Daily steps >>> ', res);
          //     res ? resolve(res) : reject(false);
          //   })
          //   .catch(err => {
          //     console.log('Daily steps >>> ', err);
          //   });
        } else {
          console.log('AUTH_DENIED', authResult.message);
        }
      })
      .catch(() => {
        console.log('AUTH_ERROR');
      });
  });
};

export const getWeightFromGoogleFit = async () => {
  return new Promise((resolve, reject) => {
    const options = {
      scopes: [Scopes.FITNESS_BODY_READ_WRITE],
    };
    GoogleFit.authorize(options)
      .then(authResult => {
        if (authResult.success) {
          console.log('AUTH_SUCCESS');
          const opt = {
            unit: 'kg', // required; default 'kg'
            startDate: startDate(), // required
            endDate: endDate(), // required
            ascending: false, // optional; default false
          };
          GoogleFit.getWeightSamples(opt, (err, res) => {
            console.log('getWeightSamples' + res);
            console.log(res);
            res ? resolve(res) : reject(false);
            console.log('getWeightSamplesError' + err);
          });
        } else {
          console.log('AUTH_DENIED', authResult.message);
        }
      })
      .catch(() => {
        console.log('AUTH_ERROR');
      });
  });
};
export const getBloodPressureFromGoogleFit = async () => {
  return new Promise((resolve, reject) => {
    const options = {
      scopes: [Scopes.FITNESS_BLOOD_PRESSURE_READ_WRITE],
    };
    GoogleFit.authorize(options)
      .then(authResult => {
        if (authResult.success) {
          console.log('AUTH_SUCCESS');
          const opt = {
            startDate: startDate(), // required
            endDate: endDate(), // required
          };

          GoogleFit.getBloodPressureSamples(opt, (err, res) => {
            console.log('getBloodPressureSamples' + res);
            console.log(res);
            console.log('getBloodPressureSamplesError' + err);
            res ? resolve(res) : reject(false);
          });
        } else {
          console.log('AUTH_DENIED', authResult.message);
        }
      })
      .catch(() => {
        console.log('AUTH_ERROR');
      });
  });
};
export const getHeartRateFromGoogleFit = async () => {
  return new Promise((resolve, reject) => {
    const options = {
      scopes: [
        Scopes.FITNESS_BLOOD_PRESSURE_READ_WRITE,
        Scopes.FITNESS_BODY_READ_WRITE,
      ],
    };
    GoogleFit.authorize(options)
      .then(authResult => {
        if (authResult.success) {
          console.log('AUTH_SUCCESS');
          const opt = {
            startDate: startDate(), // required
            endDate: endDate(), // required
          };

          GoogleFit.getHeartRateSamples(opt, (err, res) => {
            console.log('getHeartRateSamples', res);
            console.log('getHeartRateSamplesError' + err);
            res ? resolve(res) : reject(false);
          });
        } else {
          console.log('AUTH_DENIED', authResult.message);
        }
      })
      .catch(() => {
        console.log('AUTH_ERROR');
      });
  });
};
export const getBloodGulocoseFromGoogleFit = async () => {
  return new Promise((resolve, reject) => {
    const options = {
      scopes: [
        Scopes.FITNESS_NUTRITION_READ_WRITE,
        Scopes.FITNESS_BODY_READ_WRITE,
        Scopes.FITNESS_BLOOD_GLUCOSE_READ_WRITE,
      ],
    };
    GoogleFit.authorize(options)
      .then(authResult => {
        if (authResult.success) {
          console.log('AUTH_SUCCESS');
          const opt = {
            startDate: startDate(), // required
            endDate: endDate(), // required
          };

          GoogleFit.getDailyNutritionSamples(opt, (err, res) => {
            console.log('getDailyNutritionSamples', res);
            console.log('getDailyNutritionSamples', err);
            res ? resolve(res) : reject(false);
          });
        } else {
          console.log('AUTH_DENIED', authResult.message);
        }
      })
      .catch(() => {
        console.log('AUTH_ERROR');
      });
  });
};
