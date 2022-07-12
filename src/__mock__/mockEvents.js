const EVENT_SHEETS = {
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

const EVENT_DOCS = {
  userTimezone: { offSet: '32400000', id: 'Asia/Dili' },
  userCountry: '',
  hostApp: 'docs',
  commonEventObject: {
    platform: 'WEB',
    hostApp: 'DOCS',
    userLocale: 'en',
    timeZone: { id: 'Asia/Dili', offset: 32400000 },
  },
  clientPlatform: 'web',
  userLocale: 'en',
  docs: {},
};

const EVENT_SLIDES = {
  userTimezone: { offSet: '32400000', id: 'Asia/Dili' },
  userCountry: '',
  hostApp: 'slides',
  commonEventObject: {
    platform: 'WEB',
    hostApp: 'SLIDES',
    userLocale: 'en',
    timeZone: { id: 'Asia/Dili', offset: 32400000 },
  },
  clientPlatform: 'web',
  userLocale: 'en',
  slides: {},
};

const EVENT_UNKNOWN_PLATFORM = {
  commonEventObject: {
    platform: 'WEB',
    hostApp: 'UNKNOWN_PLATFORM',
    userLocale: 'en',
    timeZone: { id: 'Asia/Dili', offset: 32400000 },
  },
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
  clientPlatform: 'web',
  userLocale: 'en',
  commonEventObject: {
    userLocale: 'en',
    timeZone: { offset: 32400000, id: 'Asia/Dili' },
    platform: 'WEB',
    hostApp: 'DRIVE',
  },
  drive: {
    activeCursorItem: {
      iconUrl:
        'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.folder+shared',
      title: 'mock_subfolder',
      mimeType: 'application/vnd.google-apps.folder',
      id: 'id102subfolder',
    },
    selectedItems: [
      {
        mimeType: 'application/vnd.google-apps.spreadsheet',
        iconUrl:
          'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.spreadsheet',
        id: 'id001sheets',
        title: 'mock_sheets_file1',
      },
      {
        mimeType: 'application/vnd.google-apps.spreadsheet',
        iconUrl:
          'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.spreadsheet',
        id: 'id002sheets',
        title: 'mock_sheets_file2_not_owner',
      },
      {
        title: 'mock_docs_file',
        iconUrl:
          'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document',
        id: 'id003docs',
        mimeType: 'application/vnd.google-apps.document',
      },
      {
        iconUrl:
          'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.presentation',
        mimeType: 'application/vnd.google-apps.presentation',
        id: 'id004slides',
        title: 'mock_slides_file',
      },
      {
        id: 'id005form',
        mimeType: 'application/vnd.google-apps.form',
        iconUrl:
          'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.form',
        title: 'mock_form_file',
      },
      {
        title: 'mock_subfolder',
        mimeType: 'application/vnd.google-apps.folder',
        id: 'id102subfolder',
        iconUrl:
          'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.folder+shared',
      },
    ],
  },
  userTimezone: { id: 'Asia/Dili', offSet: '32400000' },
  hostApp: 'drive',
  userCountry: '',
};

const EVENT_DRIVE_SELECTED_NOT_OWNER_FILE = {
  clientPlatform: 'web',
  userLocale: 'en',
  commonEventObject: {
    userLocale: 'en',
    timeZone: { offset: 32400000, id: 'Asia/Dili' },
    platform: 'WEB',
    hostApp: 'DRIVE',
  },
  drive: {
    activeCursorItem: {
      mimeType: 'application/vnd.google-apps.spreadsheet',
      iconUrl:
        'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.spreadsheet',
      id: 'id002sheets',
      title: 'mock_sheets_file2_not_owner',
    },
    selectedItems: [
      {
        mimeType: 'application/vnd.google-apps.spreadsheet',
        iconUrl:
          'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.spreadsheet',
        id: 'id002sheets',
        title: 'mock_sheets_file2_not_owner',
      },
    ],
  },
  userTimezone: { id: 'Asia/Dili', offSet: '32400000' },
  hostApp: 'drive',
  userCountry: '',
};

module.exports = {
  EVENT_SHEETS,
  EVENT_DOCS,
  EVENT_SLIDES,
  EVENT_UNKNOWN_PLATFORM,
  EVENT_DRIVE_HOME,
  EVENT_DRIVE_SELECTED,
  EVENT_DRIVE_SELECTED_NOT_OWNER_FILE,
};
