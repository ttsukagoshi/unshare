const { LocalizedMessage, buildHomepage } = require('../src/unshare');
const { MOCK_USER_LOCALES } = require('../src/__mock__/mockUserLocales');
const inputPatterns = MOCK_USER_LOCALES.map((userLocale) => {
  return {
    userLocale: userLocale,
    input: {
      testName: `buildHomepage in ${userLocale}`,
      event: {
        commonEventObject: {
          platform: 'WEB',
          hostApp: 'SHEETS',
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
  test(inputPattern.input.testName, () => {
    expect(buildHomepage(inputPattern.input.event)).toEqual(
      expectedOutputs[inputPattern.userLocale]
    );
  });
});
