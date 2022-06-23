const {
  MESSAGES,
  LocalizedMessage,
  buildDriveHomepage,
} = require('../src/unshare');
const userLocales = Object.keys(MESSAGES).concat(['en_GB', 'zz']);
const inputPatterns = userLocales.map((userLocale) => {
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
const expectedOutputs = userLocales.reduce((obj, userLocale) => {
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
