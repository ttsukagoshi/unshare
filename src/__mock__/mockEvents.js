const EVENT_SHEET = {
  userTimezone: { offSet: '32400000', id: 'Asia/Dili' },
  userCountry: '',
  hostApp: 'sheets',
  commonEventObject: {
    platform: 'WEB',
    hostApp: 'SHEETS',
    userLocale: 'en',
    timeZone: { id: 'Asia/Dili', offset: 32400000 },
  },
  clientPlatform: 'web',
  userLocale: 'en',
  sheets: {},
};

const EVENT_DRIVE_HOME = {
  clientPlatform: 'web',
  commonEventObject: {
    hostApp: 'DRIVE',
    timeZone: { offset: 32400000, id: 'Asia/Dili' },
    platform: 'WEB',
    userLocale: 'en',
  },
  drive: {},
  hostApp: 'drive',
  userCountry: '',
  userLocale: 'en',
  userTimezone: { id: 'Asia/Dili', offSet: '32400000' },
};

const EVENT_DRIVE_SELECTED = {
  commonEventObject: {
    userLocale: 'en',
    timeZone: { id: 'Asia/Dili', offset: 32400000 },
    hostApp: 'DRIVE',
    platform: 'WEB',
  },
  userTimezone: { offSet: '32400000', id: 'Asia/Dili' },
  drive: {
    activeCursorItem: {
      mimeType: 'application/vnd.google-apps.presentation',
      id: 'fileId1',
      iconUrl:
        'https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.presentation',
      title: 'test slide',
    },
    selectedItems: [
      {
        iconUrl:
          'https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.presentation',
        title: 'test slide',
        id: 'fileId1',
        mimeType: 'application/vnd.google-apps.presentation',
      },
      {
        mimeType: 'application/vnd.google-apps.document',
        iconUrl:
          'https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.google-apps.document',
        id: 'fileId2',
        title: 'test document',
      },
    ],
  },
  userLocale: 'en',
  hostApp: 'drive',
  userCountry: '',
  clientPlatform: 'web',
};

module.exports = { EVENT_SHEET, EVENT_DRIVE_HOME, EVENT_DRIVE_SELECTED };
