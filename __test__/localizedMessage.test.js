const { MESSAGES, LocalizedMessage } = require('../src/unshare');

// Check the number of keys, i.e. the number of messages
// in MESSAGES for the respective locales
// to see if it matches that of the default locale: 'en'
// Failing this test would mean that there is a difference
// the number of messages between locales.
Object.keys(MESSAGES).forEach((locale) => {
  if (locale !== 'en') {
    test(`Check number of messages in ${locale} to match that of en`, () => {
      expect(Object.keys(MESSAGES[locale]).length).toBe(
        Object.keys(MESSAGES['en']).length
      );
    });
  }
});

// Test the constructor of LocalizedMessage class
const patterns = [
  { input: 'en', expectedOutput: 'en' },
  { input: 'ja', expectedOutput: 'ja' },
  { input: 'en-GB', expectedOutput: 'en' },
  { input: 'zz', expectedOutput: 'en' },
  { input: 'unknown', expectedOutput: 'en' },
];
patterns.forEach((pattern) => {
  test(`Check constructor of LocalizedMessage class: ${pattern.input}`, () => {
    let localizedMessage = new LocalizedMessage(pattern.input);
    expect(localizedMessage.locale).toBe(pattern.expectedOutput);
  });
});
