// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createMessageCard } = require('../src/unshare');
const TEST_MESSAGE = 'This is a test message for createMessageCard';
const USER_LOCALE = 'en';

const patterns = [
  {
    testName: 'Check createMessageCard: isHostDrive=true',
    input: {
      isHostDrive: true,
    },
    expectedOutput: {
      sections: [
        {
          widgets: [{ text: TEST_MESSAGE }],
        },
      ],
      fixedFooter: {
        primaryButton: {
          text: 'Return Home', // localizedMessage.messageList.buttonReturnHome
          textButtonStyle: 'FILLED',
          onClickAction: { functionName: 'buildDriveHomepage' },
          openLink: '',
        },
        secondaryButton: {},
      },
    },
  },
  {
    testName: 'Check createMessageCard: isHostDrive = false',
    input: {
      isHostDrive: false,
    },
    expectedOutput: {
      sections: [
        {
          widgets: [{ text: TEST_MESSAGE }],
        },
      ],
      fixedFooter: {
        primaryButton: {
          text: 'Return Home', // localizedMessage.messageList.buttonReturnHome
          textButtonStyle: 'FILLED',
          onClickAction: { functionName: 'buildHomepage' },
          openLink: '',
        },
        secondaryButton: {},
      },
    },
  },
];

patterns.forEach((pattern) => {
  test(pattern.testName, () => {
    expect(
      createMessageCard(TEST_MESSAGE, USER_LOCALE, pattern.input.isHostDrive),
    ).toEqual(pattern.expectedOutput);
  });
});
