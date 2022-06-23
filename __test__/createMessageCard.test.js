const { createMessageCard, LocalizedMessage } = require('../src/unshare');
const { MOCK_USER_LOCALES } = require('../src/__mock__/mockUserLocales');
const TEST_MESSAGE = 'This is a test message for createMessageCard';

const inputPatterns = [
  {
    testName: 'createMessageCard: isHostDrive=true',
    isHostDrive: true,
    functionName,
  },
  {
    testName: 'createMessageCard: isHostDrive=false',
    isHostDrive: false,
  },
];
const patterns = MOCK_USER_LOCALES.reduce((obj, userLocale) => {
  let localizedMessage = new LocalizedMessage(userLocale);
  [
    'createMessageCard: isHostDrive=true',
    'createMessageCard: isHostDrive=false',
  ].forEach((testName) => {
    obj[testName][userLocale] = {
      input: {},
      output: {
        sections: [
          {
            widgets: [{ text: TEST_MESSAGE }],
          },
        ],
        fixedFooter: {
          primaryButton: {
            text: localizedMessage.messageList.buttonReturnHome,
            onClickAction: { functionName: 'buildConfirmationPage' },
            openLink: '',
          },
          secondaryButton: {
            text: localizedMessage.messageList.buttonHelp,
            onClickAction: {},
            openLink: 'https://www.scriptable-assets.page/add-ons/unshare/',
          },
        },
      },
    };
  });
  return obj;
}, {});
