// eslint-disable-next-line @typescript-eslint/no-var-requires
const unshare = require('../src/unshare');

describe('MESSAGES', () => {
  it('should have the same number of messages for each locale', () => {
    Object.keys(unshare.MESSAGES).forEach((locale) => {
      const defaultLocale = 'en';
      if (locale !== defaultLocale) {
        expect(Object.keys(unshare.MESSAGES[locale]).length).toBe(
          Object.keys(unshare.MESSAGES[defaultLocale]).length,
        );
      }
    });
  });
});

describe('LocalizedMessage', () => {
  it('should return the localized message', () => {
    const localizedMessage = new unshare.LocalizedMessage('ja');
    expect(localizedMessage.locale).toBe('ja');
    expect(localizedMessage.messageList.buttonCancel).toBe('キャンセル');
  });
  it('should return the closest locale when region is specified', () => {
    const localizedMessage = new unshare.LocalizedMessage('en-US');
    expect(localizedMessage.locale).toBe('en');
  });
  const localePatterns = ['unknown', 'zz'];
  it.each(localePatterns)(
    'should default to `en` when an unknown locale `%s` is specified',
    (locale) => {
      const localizedMessage = new unshare.LocalizedMessage(locale);
      expect(localizedMessage.locale).toBe('en');
    },
  );
  it('should return the replaced message for replaceConfirmationMessage', () => {
    const localizedMessage = new unshare.LocalizedMessage('en');
    const message = localizedMessage.replaceConfirmationMessage(
      'SampleTargetFilesSummary',
      'SampleIgnoredFilesSummary',
    );
    expect(message).toBe(
      'Are you sure you want to proceed with Unshare? You will be permanently removing all editors and viewers (including commenters) from these file/folder(s):SampleTargetFilesSummary\n<b>THIS ACTION CANNOT BE UNDONE</b>.\n\nSampleIgnoredFilesSummary',
    );
  });
  it('should return the replaced message for replaceErrorYouMustBeOwner', () => {
    const localizedMessage = new unshare.LocalizedMessage('en');
    const message = localizedMessage.replaceErrorYouMustBeOwner(
      'SampleIsNotOwnerFileNameList',
    );
    expect(message).toBe(
      '[ERROR] You must be the owner of the file/folder(s) to execute Unshare:\nSampleIsNotOwnerFileNameList',
    );
  });
  it('should return the replaced message for replaceErrorExceededTimeLimit', () => {
    const localizedMessage = new unshare.LocalizedMessage('en');
    const message = localizedMessage.replaceErrorExceededTimeLimit(
      'SampleAddonExecTimeLimitInSec',
      'SampleUnfinishedFilesList',
    );
    expect(message).toBe(
      '[Exceeded Time Limit]\nThe execution time of Unshare is limited to SampleAddonExecTimeLimitInSec seconds by Google. It could not finish "un"sharing the following file/folder(s) due to this limit:\nSampleUnfinishedFilesList',
    );
  });
});

describe('buildHomepage, buildDriveItemsSelected, and buildDriveHomepage', () => {
  beforeEach(() => {
    global.CardService = {
      newAction: jest.fn(() => ({
        setFunctionName: jest.fn(),
      })),
      newCardBuilder: jest.fn(() => ({
        addSection: jest.fn(),
        setFixedFooter: jest.fn(),
        build: jest.fn(),
      })),
      newCardSection: jest.fn(() => ({
        addWidget: jest.fn(),
      })),
      newFixedFooter: jest.fn(() => ({
        setPrimaryButton: jest.fn(() => ({
          setSecondaryButton: jest.fn(),
        })),
      })),
      newOpenLink: jest.fn(() => ({
        setUrl: jest.fn(),
      })),
      newTextButton: jest.fn(() => ({
        setText: jest.fn(() => ({
          setOnClickAction: jest.fn(),
          setOpenLink: jest.fn(),
        })),
      })),
      newTextParagraph: jest.fn(() => ({
        setText: jest.fn(),
      })),
    };
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  const mockEvent = {
    commonEventObject: {
      userLocale: 'en',
    },
  };
  it('should call the card builder methods for buildHomepage', () => {
    unshare.buildHomepage(mockEvent);
    expect(CardService.newAction).toHaveBeenCalled();
    expect(CardService.newCardBuilder).toHaveBeenCalled();
    expect(CardService.newCardSection).toHaveBeenCalled();
    expect(CardService.newFixedFooter).toHaveBeenCalled();
    expect(CardService.newOpenLink).toHaveBeenCalled();
    expect(CardService.newTextButton).toHaveBeenCalled();
    expect(CardService.newTextParagraph).toHaveBeenCalled();
  });
  it('should call the card builder methods for buildDriveItemsSelected', () => {
    unshare.buildDriveItemsSelected(mockEvent);
    expect(CardService.newAction).toHaveBeenCalled();
    expect(CardService.newCardBuilder).toHaveBeenCalled();
    expect(CardService.newCardSection).toHaveBeenCalled();
    expect(CardService.newFixedFooter).toHaveBeenCalled();
    expect(CardService.newOpenLink).toHaveBeenCalled();
    expect(CardService.newTextButton).toHaveBeenCalled();
    expect(CardService.newTextParagraph).toHaveBeenCalled();
  });
  it('should call the card builder methods for buildDriveHomepage', () => {
    unshare.buildDriveHomepage(mockEvent);
    expect(CardService.newCardBuilder).toHaveBeenCalled();
    expect(CardService.newCardSection).toHaveBeenCalled();
    expect(CardService.newTextParagraph).toHaveBeenCalled();
  });
});

describe('buildConfirmationPage', () => {
  const mockOwner = { getEmail: jest.fn(() => 'my.email@gmail.com') };
  const mockNonOwner = { getEmail: jest.fn(() => 'not.my.email@gmail.com') };
  const mockEditors = [
    { getEmail: jest.fn(() => 'editor1@gmail.com') },
    { getEmail: jest.fn(() => 'editor2@gmail.com') },
  ];
  const mockViewers = [{ getEmail: jest.fn(() => 'viewer@gmail.com') }];
  beforeEach(() => {
    global.Session = {
      getActiveUser: jest.fn(() => ({
        getEmail: jest.fn(() => mockOwner.getEmail()), // Owner
      })),
    };
    global.CardService = {
      TextButtonStyle: {
        FILLED: 'FILLED',
      },
      newAction: jest.fn(() => ({
        setFunctionName: jest.fn(),
      })),
      newCardBuilder: jest.fn(() => ({
        addSection: jest.fn(() => ({
          setFixedFooter: jest.fn(),
          build: jest.fn(),
        })),
        setFixedFooter: jest.fn(),
        build: jest.fn(),
      })),
      newCardSection: jest.fn(() => ({
        addWidget: jest.fn(),
      })),
      newFixedFooter: jest.fn(() => ({
        setPrimaryButton: jest.fn(() => ({
          setSecondaryButton: jest.fn(),
        })),
      })),
      newTextButton: jest.fn(() => ({
        setText: jest.fn(() => ({
          setOpenLink: jest.fn(),
          setOnClickAction: jest.fn(),
          setTextButtonStyle: jest.fn(() => ({
            setOnClickAction: jest.fn(),
          })),
        })),
      })),
      newTextParagraph: jest.fn(() => ({
        setText: jest.fn(),
      })),
    };
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  const mockBaseEvent = {
    commonEventObject: {
      userLocale: 'en',
    },
  };
  it('should call the card builder methods for buildConfirmationPage', () => {
    global.CacheService = {
      getUserCache: jest.fn(() => ({
        get: jest.fn(() => null), // Return null to simulate no previous cache
        put: jest.fn(),
      })),
    };
    global.DriveApp = {
      getFileById: jest
        .fn()
        .mockReturnValueOnce({
          getOwner: jest.fn(() => mockOwner), // Owner
          getEditors: jest.fn(() => mockEditors),
          getViewers: jest.fn(() => mockViewers),
          getMimeType: jest.fn(() => 'application/vnd.google-apps.document'),
          getName: jest.fn(() => 'Sample-Document-Name'),
        })
        .mockReturnValueOnce({
          getOwner: jest.fn(() => mockNonOwner), // Not Owner
          getEditors: jest.fn(() => mockEditors),
          getViewers: jest.fn(() => mockViewers),
          getMimeType: jest.fn(
            () => 'application/vnd.google-apps.presentation',
          ),
          getName: jest.fn(() => 'Sample-Presentation-Name'),
        }),
    };
    const mockEvent = {
      ...mockBaseEvent,
      ...{
        drive: {
          selectedItems: [{ id: 'DriveItemID1' }, { id: 'DriveItemID2' }],
        },
      },
    };
    mockEvent.commonEventObject = {
      ...mockBaseEvent.commonEventObject,
      ...{ hostApp: 'DRIVE' },
    };
    console.log('mockEvent', mockEvent);
    unshare.buildConfirmationPage(mockEvent);
    expect(DriveApp.getFileById).toHaveBeenCalledTimes(2);
    expect(CardService.newCardBuilder).toHaveBeenCalled();
  });
  it('should call the card builder methods for buildConfirmationPage: isNotOwner.length === 0', () => {
    global.CacheService = {
      getUserCache: jest.fn(() => ({
        get: jest.fn(() => null), // Return null to simulate no previous cache
        put: jest.fn(),
      })),
    };
    global.DriveApp = {
      getFileById: jest.fn().mockReturnValue({
        getOwner: jest.fn(() => mockOwner), // Owner
        getEditors: jest.fn(() => mockEditors),
        getViewers: jest.fn(() => mockViewers),
        getMimeType: jest.fn(() => 'application/vnd.google-apps.document'),
        getName: jest.fn(() => 'Sample-Document-Name'),
      }),
    };
    const mockEvent = {
      ...mockBaseEvent,
      ...{
        drive: {
          selectedItems: [{ id: 'DriveItemID1' }, { id: 'DriveItemID2' }],
        },
      },
    };
    mockEvent.commonEventObject = {
      ...mockBaseEvent.commonEventObject,
      ...{ hostApp: 'DRIVE' },
    };
    console.log('mockEvent', mockEvent);
    unshare.buildConfirmationPage(mockEvent);
    expect(DriveApp.getFileById).toHaveBeenCalledTimes(2);
    expect(CardService.newCardBuilder).toHaveBeenCalled();
  });
  it('should call the card builder methods for buildConfirmationPage: hostApp !== "DRIVE"', () => {
    global.CacheService = {
      getUserCache: jest.fn(() => ({
        get: jest.fn(() => null), // Return null to simulate no previous cache
        put: jest.fn(),
      })),
    };
    global.DocumentApp = {
      getActiveDocument: jest.fn(() => ({
        getId: jest.fn(() => 'Sample-Document-ID'),
      })),
    };
    global.DriveApp = {
      getFileById: jest.fn().mockReturnValue({
        getOwner: jest.fn(() => mockOwner), // Owner
        getEditors: jest.fn(() => mockEditors),
        getViewers: jest.fn(() => mockViewers),
        getMimeType: jest.fn(() => 'application/vnd.google-apps.document'),
        getName: jest.fn(() => 'Sample-Document-Name'),
      }),
    };
    const mockEvent = { ...mockBaseEvent };
    mockEvent.commonEventObject = {
      ...mockBaseEvent.commonEventObject,
      ...{ hostApp: 'DOCS' },
    };
    console.log('mockEvent', mockEvent);
    unshare.buildConfirmationPage(mockEvent);
    expect(DriveApp.getFileById).toHaveBeenCalledTimes(1);
    expect(CardService.newCardBuilder).toHaveBeenCalled();
  });
  it('should catch errors in createMessageCard', () => {
    global.CacheService = {
      getUserCache: jest.fn(() => ({
        get: jest.fn(() => null), // Return null to simulate no previous cache
        put: jest.fn(),
      })),
    };
    global.DocumentApp = {
      getActiveDocument: jest.fn(() => ({
        getId: jest.fn(() => 'Sample-Document-ID'),
      })),
    };
    global.DriveApp = {
      getFileById: jest.fn().mockReturnValue({
        getOwner: jest.fn(() => mockNonOwner), // Non-Owner
        getEditors: jest.fn(() => mockEditors),
        getViewers: jest.fn(() => mockViewers),
        getMimeType: jest.fn(() => 'application/vnd.google-apps.document'),
        getName: jest.fn(() => 'Sample-Document-Name'),
      }),
    };
    const mockEvent = { ...mockBaseEvent };
    mockEvent.commonEventObject = {
      ...mockBaseEvent.commonEventObject,
      ...{ hostApp: 'DOCS' },
    };
    console.log('mockEvent', mockEvent);
    unshare.buildConfirmationPage(mockEvent);
    expect(DriveApp.getFileById).toHaveBeenCalledTimes(1);
    expect(CardService.newCardBuilder).toHaveBeenCalled();
  });
});

describe('createMessageCard', () => {
  beforeEach(() => {
    global.CardService = {
      TextButtonStyle: {
        FILLED: 'FILLED',
      },
      newAction: jest.fn(() => ({
        setFunctionName: jest.fn(),
      })),
      newCardBuilder: jest.fn(() => ({
        addSection: jest.fn(() => ({
          setFixedFooter: jest.fn(),
          build: jest.fn(),
        })),
      })),
      newCardSection: jest.fn(() => ({
        addWidget: jest.fn(),
      })),
      newFixedFooter: jest.fn(() => ({
        setPrimaryButton: jest.fn(),
      })),
      newTextButton: jest.fn(() => ({
        setText: jest.fn(() => ({
          setOpenLink: jest.fn(),
          setTextButtonStyle: jest.fn(() => ({
            setOnClickAction: jest.fn(),
          })),
        })),
      })),
      newTextParagraph: jest.fn(() => ({
        setText: jest.fn(),
      })),
    };
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  const mockMessage = 'SampleMessage';
  it('should call the card builder methods for createMessageCard: isHostDrive=false', () => {
    unshare.createMessageCard(mockMessage, 'en', false);
    expect(CardService.newAction).toHaveBeenCalled();
    expect(CardService.newCardBuilder).toHaveBeenCalled();
    expect(CardService.newCardSection).toHaveBeenCalled();
    expect(CardService.newFixedFooter).toHaveBeenCalled();
    expect(CardService.newTextButton).toHaveBeenCalled();
    expect(CardService.newTextParagraph).toHaveBeenCalled();
  });
  it('should call the card builder methods for createMessageCard: isHostDrive=true', () => {
    unshare.createMessageCard(mockMessage, 'en', true);
    expect(CardService.newAction).toHaveBeenCalled();
    expect(CardService.newCardBuilder).toHaveBeenCalled();
    expect(CardService.newCardSection).toHaveBeenCalled();
    expect(CardService.newFixedFooter).toHaveBeenCalled();
    expect(CardService.newTextButton).toHaveBeenCalled();
    expect(CardService.newTextParagraph).toHaveBeenCalled();
  });
});

describe('getFileUsers & unshare', () => {
  const mockOwner = { getEmail: jest.fn(() => 'my.email@gmail.com') };
  const mockNonOwner = { getEmail: jest.fn(() => 'not.my.email@gmail.com') };
  const mockEditors = [
    { getEmail: jest.fn(() => 'editor1@gmail.com') },
    { getEmail: jest.fn(() => 'editor2@gmail.com') },
  ];
  const mockViewers = [{ getEmail: jest.fn(() => 'viewer@gmail.com') }];
  beforeEach(() => {
    global.DocumentApp = {
      getActiveDocument: jest.fn(() => ({
        getId: jest.fn(() => 'Sample-Document-ID'),
      })),
    };
    global.SlidesApp = {
      getActivePresentation: jest.fn(() => ({
        getId: jest.fn(() => 'Sample-Presentation-ID'),
      })),
    };
    global.SpreadsheetApp = {
      getActiveSpreadsheet: jest.fn(() => ({
        getId: jest.fn(() => 'Sample-Spreadsheet-ID'),
      })),
    };
    global.Session = {
      getActiveUser: jest.fn(() => ({
        getEmail: jest.fn(() => mockOwner.getEmail()), // Owner
      })),
    };
    global.CardService = {
      TextButtonStyle: {
        FILLED: 'FILLED',
      },
      newAction: jest.fn(() => ({
        setFunctionName: jest.fn(),
      })),
      newCardBuilder: jest.fn(() => ({
        addSection: jest.fn(() => ({
          setFixedFooter: jest.fn(),
          build: jest.fn(),
        })),
      })),
      newCardSection: jest.fn(() => ({
        addWidget: jest.fn(),
      })),
      newFixedFooter: jest.fn(() => ({
        setPrimaryButton: jest.fn(),
      })),
      newTextButton: jest.fn(() => ({
        setText: jest.fn(() => ({
          setOpenLink: jest.fn(),
          setTextButtonStyle: jest.fn(() => ({
            setOnClickAction: jest.fn(),
          })),
        })),
      })),
      newTextParagraph: jest.fn(() => ({
        setText: jest.fn(),
      })),
    };
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  const mockBaseEvent = {
    commonEventObject: {
      userLocale: 'en',
    },
  };
  describe('getFileUsers on Google Sheets/Docs/Slides/Drive without previous cache', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    const mockDriveAppPatterns = [
      {
        hostApp: 'DOCS',
        mimeType: 'application/vnd.google-apps.document',
        fileName: 'Sample-Document-Name',
        fileId: 'Sample-Document-ID',
      },
      {
        hostApp: 'SLIDES',
        mimeType: 'application/vnd.google-apps.presentation',
        fileName: 'Sample-Presentation-Name',
        fileId: 'Sample-Presentation-ID',
      },
      {
        hostApp: 'SHEETS',
        mimeType: 'application/vnd.google-apps.spreadsheet',
        fileName: 'Sample-Spreadsheet-Name',
        fileId: 'Sample-Spreadsheet-ID',
      },
    ];
    it.each(mockDriveAppPatterns)(
      'should return the summarized object of the file without previous cache: hostApp=$hostApp',
      ({ hostApp, mimeType, fileName, fileId }) => {
        global.CacheService = {
          getUserCache: jest.fn(() => ({
            get: jest.fn(() => null), // Return null to simulate no previous cache
            put: jest.fn(),
          })),
        };
        global.DriveApp = {
          getFileById: jest.fn(() => ({
            getOwner: jest.fn().mockReturnValue(mockOwner),
            getEditors: jest.fn().mockReturnValue(mockEditors),
            getViewers: jest.fn().mockReturnValue(mockViewers),
            getMimeType: jest.fn(() => mimeType),
            getName: jest.fn(() => fileName),
          })),
        };
        const mockEvent = { ...mockBaseEvent };
        mockEvent.commonEventObject = {
          ...mockBaseEvent.commonEventObject,
          ...{ hostApp: hostApp },
        };
        const expectedFileUser = {
          isOwner: [
            {
              fileId: fileId,
              fileName: fileName,
              fileType: mimeType,
              owner: 'my.email@gmail.com',
              editors: ['editor1@gmail.com', 'editor2@gmail.com'],
              viewers: ['viewer@gmail.com'],
            },
          ],
          isNotOwner: [],
        };
        expect(unshare.getFileUsers(mockEvent)).toEqual(expectedFileUser);
      },
    );
    it('should return the summarized object of the file without previous cache: hostApp=DRIVE', () => {
      global.CacheService = {
        getUserCache: jest.fn(() => ({
          get: jest.fn(() => null), // Return null to simulate no previous cache
          put: jest.fn(),
        })),
      };
      global.DriveApp = {
        getFileById: jest
          .fn()
          .mockReturnValueOnce({
            getOwner: jest.fn(() => mockOwner), // Owner
            getEditors: jest.fn(() => mockEditors),
            getViewers: jest.fn(() => mockViewers),
            getMimeType: jest.fn(() => 'application/vnd.google-apps.document'),
            getName: jest.fn(() => 'Sample-Document-Name'),
          })
          .mockReturnValueOnce({
            getOwner: jest.fn(() => mockNonOwner), // Not Owner
            getEditors: jest.fn(() => mockEditors),
            getViewers: jest.fn(() => mockViewers),
            getMimeType: jest.fn(
              () => 'application/vnd.google-apps.presentation',
            ),
            getName: jest.fn(() => 'Sample-Presentation-Name'),
          }),
      };
      global.Session = {
        getActiveUser: jest.fn(() => ({
          getEmail: jest.fn(() => mockOwner.getEmail()), // Owner
        })),
      };
      const mockEvent = {
        ...mockBaseEvent,
        ...{
          drive: {
            selectedItems: [{ id: 'DriveItemID1' }, { id: 'DriveItemID2' }],
          },
        },
      };
      mockEvent.commonEventObject = {
        ...mockBaseEvent.commonEventObject,
        ...{ hostApp: 'DRIVE' },
      };
      const expectedFileUser = {
        isOwner: [
          {
            fileId: 'DriveItemID1',
            fileName: 'Sample-Document-Name',
            fileType: 'application/vnd.google-apps.document',
            owner: 'my.email@gmail.com',
            editors: ['editor1@gmail.com', 'editor2@gmail.com'],
            viewers: ['viewer@gmail.com'],
          },
        ],
        isNotOwner: [
          {
            fileId: 'DriveItemID2',
            fileName: 'Sample-Presentation-Name',
            fileType: 'application/vnd.google-apps.presentation',
            owner: 'not.my.email@gmail.com',
            editors: ['editor1@gmail.com', 'editor2@gmail.com'],
            viewers: ['viewer@gmail.com'],
          },
        ],
      };
      expect(unshare.getFileUsers(mockEvent)).toEqual(expectedFileUser);
    });
  });
  describe('getFileUsers on Google Sheets with previous cache, switching useCache values', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    const mockDriveAppPatterns = [
      {
        hostApp: 'SHEETS',
        mimeType: 'application/vnd.google-apps.spreadsheet',
        fileName: 'Sample-Spreadsheet-Name',
        fileId: 'Sample-Spreadsheet-ID',
        useCache: false,
      },
      {
        hostApp: 'SHEETS',
        mimeType: 'application/vnd.google-apps.spreadsheet',
        fileName: 'Sample-Spreadsheet-Name',
        fileId: 'Sample-Spreadsheet-ID',
        useCache: true,
      },
    ];
    it.each(mockDriveAppPatterns)(
      'should return the summarized object of the file: hostApp=$hostApp, useCache=$useCache',
      ({ hostApp, mimeType, fileName, fileId, useCache }) => {
        const expectedFileUser = {
          isOwner: [
            {
              fileId: fileId,
              fileName: fileName,
              fileType: mimeType,
              owner: 'my.email@gmail.com',
              editors: ['editor1@gmail.com', 'editor2@gmail.com'],
              viewers: ['viewer@gmail.com'],
            },
          ],
          isNotOwner: [],
        };
        global.CacheService = {
          getUserCache: jest.fn(() => ({
            get: jest.fn(() => JSON.stringify(expectedFileUser.isOwner[0])), // Return string to simulate previous cache
            put: jest.fn(),
          })),
        };
        global.DriveApp = {
          getFileById: jest.fn(() => ({
            getOwner: jest.fn().mockReturnValue(mockOwner),
            getEditors: jest.fn().mockReturnValue(mockEditors),
            getViewers: jest.fn().mockReturnValue(mockViewers),
            getMimeType: jest.fn(() => mimeType),
            getName: jest.fn(() => fileName),
          })),
        };
        const mockEvent = { ...mockBaseEvent };
        mockEvent.commonEventObject = {
          ...mockBaseEvent.commonEventObject,
          ...{ hostApp: hostApp },
        };
        expect(unshare.getFileUsers(mockEvent, useCache)).toEqual(
          expectedFileUser,
        );
      },
    );
  });
  it('getFileUsers should return an error when hostApp has unknown value', () => {
    global.CacheService = {
      getUserCache: jest.fn(() => ({
        get: jest.fn(() => null), // Return null to simulate no previous cache
        put: jest.fn(),
      })),
    };
    const mockEvent = { ...mockBaseEvent };
    mockEvent.commonEventObject = {
      ...mockBaseEvent.commonEventObject,
      ...{ hostApp: 'UNKNOWN' },
    };
    expect(() => {
      unshare.getFileUsers(mockEvent);
    }).toThrow(
      new Error(
        new unshare.LocalizedMessage(
          'en',
        ).messageList.errorUnavailbleOnThisPlatform,
      ),
    );
  });
  describe('unshare on Google Drive', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should return the summarized object of the file without previous cache: hostApp=DRIVE', () => {
      global.CacheService = {
        getUserCache: jest.fn(() => ({
          get: jest.fn(() => null), // Return null to simulate no previous cache
          put: jest.fn(),
        })),
      };
      global.DriveApp = {
        Access: {
          PRIVATE: 'PRIVATE',
        },
        Permission: {
          VIEW: 'VIEW',
        },
        getFileById: jest
          .fn()
          .mockReturnValueOnce({
            // getFileById for the first file
            getOwner: jest.fn(() => mockOwner), // Owner
            getEditors: jest.fn(() => mockEditors),
            getViewers: jest.fn(() => mockViewers),
            getMimeType: jest.fn(() => 'application/vnd.google-apps.document'),
            getName: jest.fn(() => 'Sample-Document-Name'),
          })
          .mockReturnValueOnce({
            // getFileById for the second file
            getOwner: jest.fn(() => mockNonOwner), // Not Owner
            getEditors: jest.fn(() => mockEditors),
            getViewers: jest.fn(() => mockViewers),
            getMimeType: jest.fn(
              () => 'application/vnd.google-apps.presentation',
            ),
            getName: jest.fn(() => 'Sample-Presentation-Name'),
          })
          .mockReturnValueOnce({
            // unshare for the first file
            setSharing: jest.fn(),
            removeEditor: jest.fn(),
            removeViewer: jest.fn(),
          }),
      };
      global.Session = {
        getActiveUser: jest.fn(() => ({
          getEmail: jest.fn(() => mockOwner.getEmail()), // Owner
        })),
      };
      const mockEvent = {
        ...mockBaseEvent,
        ...{
          drive: {
            selectedItems: [{ id: 'DriveItemID1' }, { id: 'DriveItemID2' }],
          },
        },
      };
      mockEvent.commonEventObject = {
        ...mockBaseEvent.commonEventObject,
        ...{ hostApp: 'DRIVE' },
      };
      unshare.unshare(mockEvent);
      expect(DriveApp.getFileById).toHaveBeenCalledTimes(3);
      expect(CardService.newCardBuilder).toHaveBeenCalled();
    });
    it('should catch an error in CardBuilder', () => {
      global.CacheService = {
        getUserCache: jest.fn(() => {
          throw new Error('Sample Error during unshare()');
        }), // Simulate an error
      };
      const mockEvent = { ...mockBaseEvent };
      mockEvent.commonEventObject = {
        ...mockBaseEvent.commonEventObject,
        ...{ hostApp: 'DRIVE' },
      };
      unshare.unshare(mockEvent);
      expect(CardService.newCardBuilder).toHaveBeenCalled();
    });
  });
});

describe('checkExecTime', () => {
  it('should should return null if the execution time is within ADDON_EXEC_TIME_LIMIT_WITH_BUFFER', () => {
    const startTime = new Date();
    expect(unshare.checkExecTime(startTime, null, null, null)).toBe(null);
  });
  it('should should return an error if the execution time exceeds ADDON_EXEC_TIME_LIMIT_WITH_BUFFER', () => {
    const startTime = new Date(
      new Date().getTime() - unshare.ADDON_EXEC_TIME_LIMIT_WITH_BUFFER,
    );
    const currentIndex = 0;
    const mockFileArray = [{ fileName: 'file1' }, { fileName: 'file2' }];
    expect(() => {
      unshare.checkExecTime(
        startTime,
        currentIndex,
        mockFileArray,
        'en',
        false,
      );
    }).toThrow(
      new Error(
        new unshare.LocalizedMessage('en').replaceErrorExceededTimeLimit(
          unshare.ADDON_EXEC_TIME_LIMIT_IN_MILLISEC / 1000,
          'file1\nfile2',
        ),
      ),
    );
    expect(() => {
      unshare.checkExecTime(startTime, currentIndex, mockFileArray, 'en', true);
    }).toThrow(
      new Error(
        new unshare.LocalizedMessage('en').replaceErrorExceededTimeLimit(
          unshare.ADDON_EXEC_TIME_LIMIT_IN_MILLISEC / 1000,
          'file2',
        ),
      ),
    );
  });
});

describe('filteredErrorMessage', () => {
  it('should return the error message if it starts with [ERROR]', () => {
    const errorMessage = {
      message: '[ERROR] Some error message',
      stack: 'Error: Some error message\n    at ...',
    };
    expect(unshare.filteredErrorMessage(errorMessage)).toBe(
      errorMessage.message,
    );
  });
  it('should return the error message if it starts with [Exceeded Time Limit]', () => {
    const errorMessage = {
      message: '[Exceeded Time Limit]\n Some error message',
      stack: 'Error: [Exceeded Time Limit]\nSome error message\n    at ...',
    };
    expect(unshare.filteredErrorMessage(errorMessage)).toBe(
      errorMessage.message,
    );
  });
  it('should return the error stack for all other errors', () => {
    const errorMessage = {
      message: '[Unknown Error] Some error message',
      stack: 'Error: [Unknown Error] Some error message\n    at ...',
    };
    expect(unshare.filteredErrorMessage(errorMessage)).toBe(errorMessage.stack);
  });
});
