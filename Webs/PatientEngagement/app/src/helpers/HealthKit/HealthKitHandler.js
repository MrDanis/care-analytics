/* istanbul ignore file */
import AppleHealthKit from 'rn-apple-healthkit';
var d = new Date();
var yesterday = d.setDate(d.getDate() - 6);
export const x = async () => {
  return new Promise((resolve, reject) => {
    // get the available permissions from AppleHealthKit.

    const PERMS = AppleHealthKit.Constants.Permissions;

    // setup healthkit read/write permissions using PERMS
    let healthKitOptions = {
      permissions: {
        read: [
          PERMS.StepCount,
          PERMS.Steps,
          PERMS.SleepAnalysis,
          PERMS.StepCount,
          PERMS.Steps,
          PERMS.BloodPressureDiastolic,
          PERMS.BloodPressureSystolic,
          PERMS.HeartRate,
          PERMS.BodyTemperature,
          PERMS.BloodGlucose,
          PERMS.Weight,
        ],
      },
    };
    AppleHealthKit.initHealthKit(healthKitOptions, (err, results) => {
      if (err) {
        console.log('error initializing Healthkit: ', err);
        return;
      }
      console.log('result initializing Healthkit: ', results);
      let options = {
        date: new Date().toISOString(), // required
      };
      AppleHealthKit.getStepCount(
        options,
        (err: Object, results: Array<Object>) => {
          if (err) {
            console.log('getDailyStepCountSamples', err);
            return;
          }
          console.log('getDailyStepCountSamples', results);
          results ? resolve(results) : reject(false);
        },
      );
    });
  });
};
export const HealthKitPermissions = async () => {
  // get the available permissions from AppleHealthKit.

  const PERMS = AppleHealthKit.Constants.Permissions;

  // setup healthkit read/write permissions using PERMS
  let healthKitOptions = {
    permissions: {
      read: [PERMS.StepCount, PERMS.Steps, PERMS.DistanceWalkingRunning],
    },
  };
  AppleHealthKit.initHealthKit(healthKitOptions, (err, results) => {
    if (err) {
      console.log('error initializing Healthkit: ', err);
      return;
    }
  });
};
// code by danish (START)
export const getStepCountFromHK = async () => {
  return new Promise((resolve, reject) => {
    const PERMS = AppleHealthKit.Constants.Permissions;

    let healthKitOptions = {
      permissions: {
        read: [
          PERMS.DistanceWalkingRunning,
          PERMS.StepCount,
          PERMS.Steps,
          PERMS.HeartRate,
          PERMS.SleepAnalysis,
          PERMS.BloodPressureDiastolic,
          PERMS.BloodPressureSystolic,
        ],
      },
    };
    AppleHealthKit.initHealthKit(healthKitOptions, (err, results) => {
      if (err) {
        console.log('error initializing Healthkit: ', err);
        return;
      }
      console.log('result initializing Healthkit: ', results);
      let options = {
        date: new Date().toISOString(),
      };
      AppleHealthKit.getStepCount(
        options,
        (err: Object, results: Array<Object>) => {
          if (err) {
            console.log('getDailyStepCountSamples', err);
            return;
          }
          console.log('getDailyStepCountSamples', results);
          results ? resolve(results) : reject(false);
        },
      );
    });
  });
};
export const getDistanceWalkingFromHK = async () => {
  return new Promise((resolve, reject) => {
    const PERMS = AppleHealthKit.Constants.Permissions;

    let healthKitOptions = {
      permissions: {
        read: [
          PERMS.DistanceWalkingRunning,
          PERMS.StepCount,
          PERMS.Steps,
          PERMS.HeartRate,
          PERMS.SleepAnalysis,
          PERMS.BloodPressureDiastolic,
          PERMS.BloodPressureSystolic,
        ],
      },
    };
    AppleHealthKit.initHealthKit(healthKitOptions, (err, results) => {
      if (err) {
        console.log('error initializing Healthkit: ', err);
        return;
      }
      console.log('result initializing Healthkit: ', results);
      let options = {
        date: new Date().toISOString(),
        unit: 'mile',
      };
      AppleHealthKit.getDistanceWalkingRunning(
        options,
        (err: Object, results: Array<Object>) => {
          if (err) {
            console.log('getDistanceWalkingRunning', err);
            return;
          }
          console.log('getDistanceWalkingRunning', results);
          results ? resolve(results) : reject(false);
        },
      );
    });
  });
};
// Code by Danish (END)
export const getBloodPressureHK = async () => {
  console.log('Inside getBloodPressureHK');
  return new Promise((resolve, reject) => {
    console.log('Inside Promise');
    // get the available permissions from AppleHealthKit.

    const PERMS = AppleHealthKit.Constants.Permissions;
    // setup healthkit read/write permissions using PERMS
    let healthKitOptions = {
      permissions: {
        read: [
          PERMS.DistanceWalkingRunning,
          PERMS.StepCount,
          PERMS.Steps,
          PERMS.HeartRate,
          PERMS.SleepAnalysis,
          PERMS.BloodPressureDiastolic,
          PERMS.BloodPressureSystolic,
        ],
      },
    };
    console.log('after perm');
    AppleHealthKit.initHealthKit(healthKitOptions, (err, results) => {
      console.log('Inside initHealthKit');
      if (err) {
        console.log('error initializing Healthkit: ', err);
        return;
      }
      console.log('result initializing Healthkit: ', results);
      let options = {
        unit: 'mmhg', // optional; default 'mmhg'
        startDate: new Date(yesterday).toISOString(), // required
        endDate: new Date().toISOString(), // optional; default now
        ascending: false, // optional; default false
        limit: 10, // optional; default no limit
      };
      AppleHealthKit.getBloodPressureSamples(
        options,
        (err: Object, results: Array<Object>) => {
          if (err) {
            console.log('getBloodPressureError', err);
            return;
          }
          console.log('getBloodPressure', results);
          results ? resolve(results) : reject(false);
        },
      );
    });
  });
};
export const getHeartRateHK = async () => {
  return new Promise((resolve, reject) => {
    // get the available permissions from AppleHealthKit.

    const PERMS = AppleHealthKit.Constants.Permissions;

    // setup healthkit read/write permissions using PERMS
    let healthKitOptions = {
      permissions: {
        read: [
          PERMS.DistanceWalkingRunning,
          PERMS.StepCount,
          PERMS.Steps,
          PERMS.HeartRate,
          PERMS.SleepAnalysis,
          PERMS.BloodPressureDiastolic,
          PERMS.BloodPressureSystolic,
        ],
      },
    };
    AppleHealthKit.initHealthKit(healthKitOptions, (err, results) => {
      if (err) {
        console.log('error initializing Healthkit: ', err);
        return;
      }
      console.log('result initializing Healthkit: ', results);
      let options = {
        unit: 'bpm', // optional; default 'bpm'
        startDate: new Date(yesterday).toISOString(), // required
        endDate: new Date().toISOString(), // optional; default now
        ascending: false, // optional; default false
        limit: 10, // optional; default no limit
      };
      AppleHealthKit.getHeartRateSamples(
        options,
        (err: Object, results: Array<Object>) => {
          if (err) {
            console.log('getHeartRateError', err);
            return;
          }
          console.log('getHeartRate', results);
          results ? resolve(results) : reject(false);
        },
      );
    });
  });
};
export const getTemperatureHK = async () => {
  return new Promise((resolve, reject) => {
    // get the available permissions from AppleHealthKit.

    const PERMS = AppleHealthKit.Constants.Permissions;

    // setup healthkit read/write permissions using PERMS
    let healthKitOptions = {
      permissions: {
        read: [PERMS.BodyTemperature],
      },
    };
    AppleHealthKit.initHealthKit(healthKitOptions, (err, results) => {
      if (err) {
        console.log('error initializing Healthkit: ', err);
        return;
      }
      console.log('result initializing Healthkit: ', results);
      let options = {
        unit: 'fahrenheit', // optional; default 'celsius'
        startDate: new Date(yesterday).toISOString(), // required
        endDate: new Date().toISOString(), // optional; default now
        ascending: false, // optional; default false
        limit: 10, // optional; default no limit
      };
      AppleHealthKit.getBodyTemperatureSamples(
        options,
        (err: Object, results: Array<Object>) => {
          if (err) {
            console.log('getTemperatureError', err);
            return;
          }
          console.log('getTemperature', results);
          results ? resolve(results) : reject(false);
        },
      );
    });
  });
};
export const getBloodGlucoseHK = async () => {
  return new Promise((resolve, reject) => {
    // get the available permissions from AppleHealthKit.

    const PERMS = AppleHealthKit.Constants.Permissions;

    // setup healthkit read/write permissions using PERMS
    let healthKitOptions = {
      permissions: {
        read: [PERMS.BloodGlucose],
      },
    };
    AppleHealthKit.initHealthKit(healthKitOptions, (err, results) => {
      if (err) {
        console.log('error initializing Healthkit: ', err);
        return;
      }
      console.log('result initializing Healthkit: ', results);
      let options = {
        unit: 'mgPerdL', // optional; default 'mmolPerL'
        startDate: new Date(yesterday).toISOString(), // required
        endDate: new Date().toISOString(), // optional; default now
        ascending: false, // optional; default false
        limit: 10, // optional; default no limit
      };
      AppleHealthKit.getBloodGlucoseSamples(
        options,
        (err: Object, results: Array<Object>) => {
          if (err) {
            console.log('getBloodGlucoseError', err);
            return;
          }
          console.log('getBloodGlucose', results);
          results ? resolve(results) : reject(false);
        },
      );
    });
  });
};
export const getWeightHK = async () => {
  return new Promise((resolve, reject) => {
    // get the available permissions from AppleHealthKit.

    const PERMS = AppleHealthKit.Constants.Permissions;

    // setup healthkit read/write permissions using PERMS
    let healthKitOptions = {
      permissions: {
        read: [PERMS.Weight],
      },
    };
    AppleHealthKit.initHealthKit(healthKitOptions, (err, results) => {
      if (err) {
        console.log('error initializing Healthkit: ', err);
        return;
      }
      console.log('result initializing Healthkit: ', results);
      let options = {
        unit: 'pound', // optional; default 'pound'
        startDate: new Date(yesterday).toISOString(), // required
        endDate: new Date().toISOString(), // optional; default now
        ascending: false, // optional; default false
        limit: 10, // optional; default no limit
      };
      AppleHealthKit.getWeightSamples(
        options,
        (err: Object, results: Array<Object>) => {
          if (err) {
            console.log('getWeightError', err);
            return;
          }
          console.log('getWeight', results);
          results ? resolve(results) : reject(false);
        },
      );
    });
  });
};
export const getSleepSamplesHK = async () => {
  console.log('Inside getSleepSamplesHK');
  return new Promise((resolve, reject) => {
    console.log('Inside Promise');

    // Define the required permissions for sleep data.
    const PERMS = AppleHealthKit.Constants.Permissions;

    // Setup healthkit read permissions.
    let healthKitOptions = {
      permissions: {
        read: [
          PERMS.DistanceWalkingRunning,
          PERMS.StepCount,
          PERMS.Steps,
          PERMS.HeartRate,
          PERMS.SleepAnalysis,
          PERMS.BloodPressureDiastolic,
          PERMS.BloodPressureSystolic,
        ],
      },
    };

    // Initialize HealthKit with the specified permissions.
    AppleHealthKit.initHealthKit(healthKitOptions, (err, results) => {
      console.log('Inside initHealthKit');
      if (err) {
        console.log('error initializing Healthkit: ', err);
        return;
      }
      console.log('result initializing Healthkit: ', results);

      // Define options for fetching sleep data.
      let options = {
        startDate: new Date(yesterday).toISOString(),
        endDate: new Date().toISOString(),
        ascending: false,
        limit: 10,
      };

      // Fetch sleep samples.
      AppleHealthKit.getSleepSamples(options, (err, results) => {
        if (err) {
          console.log('getSleepSamplesError', err);
          return;
        }
        console.log('getSleepSamples', results);
        results ? resolve(results) : reject(false);
      });
    });
  });
};
