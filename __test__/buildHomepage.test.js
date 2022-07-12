const { buildHomepage, buildDriveItemsSelected } = require('../src/unshare');
const inputBuildHomepage = {
  testName: 'Check buildHomepage in en',
  event: {
    commonEventObject: {
      platform: 'WEB',
      hostApp: 'SHEETS',
      userLocale: 'en',
    },
  },
};
const inputBuildDriveItemsSelected = {
  testName: 'Check buildDriveItemsSelected in en',
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
          // localizedMessage.messageList.homepageText
          text: 'Press the "Continue" button to stop sharing the files with your collaborators.\n\nUnshare will delete all editors, commenters, and viewers from this file/folder except for you, the owner. If the target file/folder is shared with a class of users who have general access, for example, if it is shared with the user\'s domain, that access setting will be changed to Private, where only the users explicitly granted permission can access.\n\n<b>THIS PROCESS CANNOT BE UNDONE in Unshare</b>.',
        },
      ],
    },
  ],
  fixedFooter: {
    primaryButton: {
      text: 'CONTINUE', // localizedMessage.messageList.buttonContinue
      textButtonStyle: '',
      onClickAction: { functionName: 'buildConfirmationPage' },
      openLink: '',
    },
    secondaryButton: {
      text: 'HELP', // localizedMessage.messageList.buttonHelp
      textButtonStyle: '',
      onClickAction: {},
      openLink: 'https://www.scriptable-assets.page/add-ons/unshare/',
    },
  },
};

test(inputBuildHomepage.testName, () => {
  expect(buildHomepage(inputBuildHomepage.event)).toEqual(expectedOutput);
});
test(inputBuildDriveItemsSelected.testName, () => {
  expect(buildDriveItemsSelected(inputBuildDriveItemsSelected.event)).toEqual(
    expectedOutput
  );
});
