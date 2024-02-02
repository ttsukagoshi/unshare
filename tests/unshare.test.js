// eslint-disable-next-line @typescript-eslint/no-var-requires
const { unshare } = require('../src/unshare');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { EVENT_DRIVE_SELECTED } = require('../src/__mocks__/mockEvents');

const patterns = [
  {
    testName: 'Check unshare: success',
    input: EVENT_DRIVE_SELECTED,
    expectedOutput: {
      sections: [
        {
          widgets: [
            {
              text: 'All file/folder(s) have been "un"shared.', // localizedMessage.messageList.noticeComplete
            },
          ],
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
];

patterns.forEach((pattern) => {
  test(pattern.testName, () => {
    expect(unshare(pattern.input)).toEqual(pattern.expectedOutput);
  });
});
