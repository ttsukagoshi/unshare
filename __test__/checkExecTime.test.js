const {
  ADDON_EXEC_TIME_LIMIT_IN_MILLISEC,
  checkExecTime,
  LocalizedMessage,
} = require('../src/unshare');
const now = new Date();
const currentIndex = 1;
const originalFileArray = [
  { id: 'fileId1', fileName: 'fileName1' },
  { id: 'fileId2', fileName: 'fileName2' },
  { id: 'fileId3', fileName: 'fileName3' },
];
const { MOCK_USER_LOCALES } = require('../src/__mock__/mockUserLocales');

const patterns = [
  {
    patternName: 'checkExecTime: Within time limit',
    input: {
      withinTimelimit: true,
      startTime: now,
      isFileEnd: false,
      slicePos: currentIndex,
    },
  },
  {
    patternName: 'checkExecTime: Exceed time limit, File end: true',
    input: {
      withinTimelimit: false,
      startTime: new Date(now.getTime() - ADDON_EXEC_TIME_LIMIT_IN_MILLISEC),
      isFileEnd: true,
      slicePos: currentIndex + 1,
    },
  },
  {
    patternName: 'checkExecTime: Exceed time limit, File end: false',
    input: {
      withinTimelimit: false,
      startTime: new Date(now.getTime() - ADDON_EXEC_TIME_LIMIT_IN_MILLISEC),
      isFileEnd: false,
      slicePos: currentIndex,
    },
  },
];

let mappedPatterns = MOCK_USER_LOCALES.reduce((arr, userLocale) => {
  patterns.forEach((pattern) => {
    let localizedMessage = new LocalizedMessage(userLocale);
    let copyPattern = {
      patternName: `${pattern.patternName}, userLocale: ${userLocale}`,
      input: {
        userLocale: userLocale,
        withinTimelimit: pattern.input.withinTimelimit,
        startTime: pattern.input.startTime,
        isFileEnd: pattern.input.isFileEnd,
        slicePos: pattern.input.slicePos,
      },
      expectedOutput: pattern.input.withinTimelimit
        ? null
        : localizedMessage.replaceErrorExceededTimeLimit(
            ADDON_EXEC_TIME_LIMIT_IN_MILLISEC / 1000,
            originalFileArray
              .slice(pattern.input.slicePos)
              .map((file) => file.fileName)
              .join('\n')
          ),
    };
    arr.push(copyPattern);
  });
  return arr;
}, []);

mappedPatterns.forEach((pattern) => {
  test(pattern.patternName, () => {
    if (pattern.input.withinTimelimit) {
      expect(
        checkExecTime(
          pattern.input.startTime,
          currentIndex,
          originalFileArray,
          pattern.input.userLocale,
          pattern.input.isFileEnd
        )
      ).toBe(pattern.expectedOutput);
    } else {
      expect(() => {
        checkExecTime(
          pattern.input.startTime,
          currentIndex,
          originalFileArray,
          pattern.input.userLocale,
          pattern.input.isFileEnd
        );
      }).toThrowError(new Error(pattern.expectedOutput));
    }
  });
});
