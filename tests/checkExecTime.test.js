const {
  ADDON_EXEC_TIME_LIMIT_IN_MILLISEC,
  checkExecTime,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require('../src/unshare');
const now = new Date();
const userLocale = 'en';
const currentIndex = 1;
const originalFileArray = [
  { id: 'fileId1', fileName: 'fileName1' },
  { id: 'fileId2', fileName: 'fileName2' },
  { id: 'fileId3', fileName: 'fileName3' },
];

const patterns = [
  {
    patternName: 'Check checkExecTime: Within time limit',
    input: {
      withinTimelimit: true,
      startTime: now,
      isFileEnd: false,
    },
    expectedOutput: null,
  },
  {
    patternName: 'checkExecTime: Exceed time limit, File end: true',
    input: {
      withinTimelimit: false,
      startTime: new Date(now.getTime() - ADDON_EXEC_TIME_LIMIT_IN_MILLISEC),
      isFileEnd: true,
    },
    expectedOutput: `[Exceeded Time Limit]\nThe execution time of Unshare is limited to ${
      ADDON_EXEC_TIME_LIMIT_IN_MILLISEC / 1000
    } seconds by Google. It could not finish "un"sharing the following file/folder(s) due to this limit:\n${originalFileArray
      .slice(currentIndex + 1)
      .map((file) => file.fileName)
      .join('\n')}`, // localizedMessage.replaceErrorExceededTimeLimit
  },
  {
    patternName: 'checkExecTime: Exceed time limit, File end: false',
    input: {
      withinTimelimit: false,
      startTime: new Date(now.getTime() - ADDON_EXEC_TIME_LIMIT_IN_MILLISEC),
      isFileEnd: false,
    },
    expectedOutput: `[Exceeded Time Limit]\nThe execution time of Unshare is limited to ${
      ADDON_EXEC_TIME_LIMIT_IN_MILLISEC / 1000
    } seconds by Google. It could not finish "un"sharing the following file/folder(s) due to this limit:\n${originalFileArray
      .slice(currentIndex)
      .map((file) => file.fileName)
      .join('\n')}`, // localizedMessage.replaceErrorExceededTimeLimit
  },
];

patterns.forEach((pattern) => {
  test(pattern.patternName, () => {
    if (pattern.input.withinTimelimit) {
      expect(
        checkExecTime(
          pattern.input.startTime,
          currentIndex,
          originalFileArray,
          userLocale,
          pattern.input.isFileEnd,
        ),
      ).toBe(pattern.expectedOutput);
    } else {
      expect(() => {
        checkExecTime(
          pattern.input.startTime,
          currentIndex,
          originalFileArray,
          userLocale,
          pattern.input.isFileEnd,
        );
      }).toThrowError(new Error(pattern.expectedOutput));
    }
  });
});
