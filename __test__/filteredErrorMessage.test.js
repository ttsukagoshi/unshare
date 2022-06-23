const { filteredErrorMessage } = require('../src/unshare');
const patterns = [
  {
    patternName: 'Message starting with "[ERROR]"',
    testInput: {
      message: '[ERROR] This is a test message',
      stack: '"[ERROR]" error stack with line numbers',
    },
    expectedOutput: '[ERROR] This is a test message',
  },
  {
    patternName: 'Message starting with "[Exceeded Time Limit]"',
    testInput: {
      message: '[Exceeded Time Limit]\nThis is a test message',
      stack: '"[Exceeded Time Limit]" error stack with line numbers',
    },
    expectedOutput: '[Exceeded Time Limit]\nThis is a test message',
  },
  {
    patternName: 'Unspecified error message',
    testInput: {
      message: 'This is a test message',
      stack: 'Error stack with line numbers',
    },
    expectedOutput: 'Error stack with line numbers',
  },
];

patterns.forEach((pattern) => {
  test(pattern.patternName, () => {
    expect(filteredErrorMessage(pattern.testInput)).toBe(
      pattern.expectedOutput
    );
  });
});
