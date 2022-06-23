const {
  LocalizedMessage,
  buildHomepage,
  buildDriveItemsSelected,
} = require('../src/unshare');
const { MOCK_USER_LOCALES } = require('../src/__mock__/mockUserLocales');
const inputPatterns = MOCK_USER_LOCALES.map((userLocale) => {
  return {
    userLocale: userLocale,
    inputBuildHomepage: {
      testName: `buildHomepage in ${userLocale}`,
      event: {
        commonEventObject: {
          platform: 'WEB',
          hostApp: 'SHEETS',
          userLocale: userLocale,
        },
      },
    },
    inputBuildDriveItemsSelected: {
      testName: `buildDriveItemsSelected in ${userLocale}`,
      event: {
        commonEventObject: {
          platform: 'WEB',
          hostApp: 'DRIVE',
          userLocale: userLocale,
        },
      },
    },
  };
});
const expectedOutputs = MOCK_USER_LOCALES.reduce((obj, userLocale) => {
  let localizedMessage = new LocalizedMessage(userLocale);
  obj[userLocale] = {
    sections: [
      {
        widgets: [{ text: localizedMessage.messageList.homepageText }],
      },
    ],
    fixedFooter: {
      primaryButton: {
        text: localizedMessage.messageList.buttonContinue,
        onClickAction: { functionName: 'buildConfirmationPage' },
        openLink: '',
      },
      secondaryButton: {
        text: localizedMessage.messageList.buttonHelp,
        onClickAction: {},
        openLink: 'https://www.scriptable-assets.page/add-ons/unshare/',
      },
    },
  };
  return obj;
}, {});

inputPatterns.forEach((inputPattern) => {
  test(inputPattern.inputBuildHomepage.testName, () => {
    expect(buildHomepage(inputPattern.inputBuildHomepage.event)).toEqual(
      expectedOutputs[inputPattern.userLocale]
    );
  });
  test(inputPattern.inputBuildDriveItemsSelected.testName, () => {
    expect(
      buildDriveItemsSelected(inputPattern.inputBuildDriveItemsSelected.event)
    ).toEqual(expectedOutputs[inputPattern.userLocale]);
  });
});
