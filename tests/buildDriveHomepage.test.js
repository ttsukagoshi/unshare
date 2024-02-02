// eslint-disable-next-line @typescript-eslint/no-var-requires
const { buildDriveHomepage } = require('../src/unshare');
const input = {
  testName: 'Check buildDriveHomepage in en',
  event: {
    commonEventObject: {
      platform: 'WEB',
      hostApp: 'DRIVE',
      userLocale: 'en',
    },
  },
};

const expectedOutput = {
  sections: [
    {
      widgets: [
        {
          // localizedMessage.messageList.homepageDriveText
          text: 'Select file(s) that you want to "un"share. Only the file/folder(s) that you own can be processed.',
        },
      ],
    },
  ],
};

test(input.testName, () => {
  expect(buildDriveHomepage(input.event)).toEqual(expectedOutput);
});
