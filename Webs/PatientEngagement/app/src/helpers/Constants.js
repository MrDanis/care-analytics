//
export const NOTIFICATION_DEFAULT_CHANNEL_ID = 'GENERAL_NOTIF_CHANNEL_ID1';
export const NOTIFICATION_DEFAULT_CHANNEL_NAME = 'Medicine Reminder Channel';
export const NOTIFICATION_MED_REMINDER_CHANNEL_ID =
  'MEDICINE_REMINDER_CHANNEL_01';
export const NOTIFICATION_MED_REMINDER_CHANNEL_NAME =
  'Medicine Reminder Channel';
// export const NOTIFICATION_REMINDER_SOUND_NAME = 'reminder.mp3';
export const NOTIFICATION_REMINDER_SOUND_NAME = '';
// export const NOTIFICATION_REMINDER_SOUND_NAME_WAV = 'reminder.wav';

export const SignalRProxy = {
  hubProxy: 'chatHub',
};
export const SignalREvents = {
  CHAT_MESSAGE_RECEIVED: 'sendMessage',
  CM_STATUS_UPDATED: 'cMStatus',
  sinchVideoEnabledEvent: 'updateVideoStatus',
  sinchCallEndedEvent: 'callDenied',
  userAction: 'UserAction',
};
export const SignalRMethods = {
  chat: 'Send',
  updateUserConnection: 'UpdatePatientTouchUserConnection',
  cmStatus: 'CareManagerStatus',
  callAction: 'CallAction',
};
export const CallActionType = {
  accept: 0,
  reject: 1,
  missed: 2,
};
export const NotificationChannel = {
  GENERAL_NOTIF_CHANNEL_ID: 'GENERAL_NOTIF_CHANNEL_ID',
  CALL_NOTIF_CHANNEL_ID: 'CallInProgressChannel',
  callInProgressNotifID: 5001,
};
export const NotificationType = {
  addMedication: 'AddMedication',

  updateMedication: 'UpdateMedication',

  chatMessage: 'ChatMessage',

  appointmentMessage: 'AppointmentMessage',

  appointmentScheduled: 'AppointmentScheduled',

  appointmentOneDay: 'AppointmentOneDay',

  appointmentTwoHour: 'AppointmentTwoHour',

  appointmentDone: 'AppointmentDone',

  vitalAdded: 'VitalAdded',

  appointmentNear: 'AppointmentNear',

  campaignMessage: 'CampaignMessage',

  campaignInvitation: 'CampaignInvitation',

  campaignSubscribed: 'CampaignSubscribe',

  campaignUnSubscribed: 'CampaignUnSubscribe',

  teleHealthEnabled: 'TeleHealthEnabled',

  vitalSyncRequest: 'VitalSyncRequest',

  CallInitiated: 'CallInitiated',

  AssessmentPublished: 'AssessmentPublished',
};
