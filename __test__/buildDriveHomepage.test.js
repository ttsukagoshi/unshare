const { LocalizedMessage, buildDriveHomepage } = require('../src/unshare');
const { MOCK_USER_LOCALES } = require('../src/__mock__/mockUserLocales');
const inputPatterns = MOCK_USER_LOCALES.map((userLocale) => {
  return {
    userLocale: userLocale,
    input: {
      testName: `buildDriveHomepage in ${userLocale}`,
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
        widgets: [{ text: localizedMessage.messageList.homepageDriveText }],
      },
    ],
  };
  return obj;
}, {});

inputPatterns.forEach((inputPattern) => {
  test(inputPattern.input.testName, () => {
    expect(buildDriveHomepage(inputPattern.input.event)).toEqual(
      expectedOutputs[inputPattern.userLocale]
    );
  });
});
