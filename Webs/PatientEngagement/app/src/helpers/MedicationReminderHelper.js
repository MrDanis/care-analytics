import {
  cancelLocalNotificationWithTag,
  scheduleLocalNotification,
} from '../helpers/NotificationHandler';

export function createOrUpdateReminderForMedication(
  medicationObject,
  medicationId,
  isUpdate,
) {
  let {fdaMedicine: medicine, doseTimings: timings} = medicationObject;
  console.log('Medication Object: ', medicationObject);
  console.log('Medicine Object ', medicine);
  let title = `${medicine.PROPRIETARYNAME} • (${medicine.Strength})`;
  let reminderMessage = `Quantity: ${medicationObject.quantity} • ${
    medicationObject.mealStatus ? 'After Meal' : 'Before Meal'
  }`;

  // Repeat Interval.
  let repeatInterval = 'day';
  if (medicationObject.frequencyInDays === 7) {
    repeatInterval = 'week';
  } else if (medicationObject.frequencyInDays === 30) {
    repeatInterval = 'month';
  }

  let todayDate = new Date().toLocaleDateString();
  console.log('medication Id', medicationId);
  // Cancel already scheduled reminders for this medication
  cancelLocalNotificationWithTag(medicationId);
  timings.forEach((value, index) => {
    let notifId = `${medicationId}0${index + 1}`;
    let fullDate = new Date().toLocaleDateString() + ' ' + value;
    let parsedDate = new Date(Date.parse(fullDate));
    let timeString = value;
    let fireDate = new Date(Date.now());
    fireDate.setHours(parsedDate.getHours(), parsedDate.getMinutes(), 0, 0);

    scheduleLocalNotification(title, reminderMessage, {
      id: notifId,
      fireDate: fireDate,
      repeatInterval: repeatInterval,
      tag: medicationId,
      medTime: timeString,
      mealStatus: medicationObject.mealStatus,
    });
  });
}
