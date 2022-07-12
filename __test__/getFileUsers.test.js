const { getFileUsers } = require('../src/unshare');
const {
  EVENT_SHEETS,
  EVENT_DOCS,
  EVENT_SLIDES,
  EVENT_UNKNOWN_PLATFORM,
  EVENT_DRIVE_SELECTED,
} = require('../src/__mocks__/mockEvents');

const patterns = [
  {
    testName: 'Check getFileUsers: SHEETS event',
    input: EVENT_SHEETS,
    expectedOutput: {
      isOwner: [
        {
          fileId: 'id001sheets',
          fileName: 'mock_sheets_file1',
          fileType: 'application/vnd.google-apps.spreadsheet',
          owner: 'me@test.com',
          editors: ['sheetsTestEditor1@test.com', 'sheetsTextEditor2@test.com'],
          viewers: ['sheetsTestViewer1@test.app'],
        },
      ],
      isNotOwner: [],
    },
  },
  {
    testName: 'Check getFileUsers: DOCS event',
    input: EVENT_DOCS,
    expectedOutput: {
      isOwner: [
        {
          fileId: 'id003docs',
          fileName: 'mock_docs_file',
          fileType: 'application/vnd.google-apps.document',
          owner: 'me@test.com',
          editors: ['docsTestEditor1@test.com', 'docsTextEditor2@test.com'],
          viewers: ['docsTestViewer1@test.app'],
        },
      ],
      isNotOwner: [],
    },
  },
  {
    testName: 'Check getFileUsers: SLIDES event',
    input: EVENT_SLIDES,
    expectedOutput: {
      isOwner: [
        {
          fileId: 'id004slides',
          fileName: 'mock_slides_file',
          fileType: 'application/vnd.google-apps.presentation',
          owner: 'me@test.com',
          editors: ['slidesTestEditor1@test.com', 'slidesTextEditor2@test.com'],
          viewers: ['slidesTestViewer1@test.app'],
        },
      ],
      isNotOwner: [],
    },
  },
  {
    testName: 'Check getFileUsers: DRIVE event',
    input: EVENT_DRIVE_SELECTED,
    expectedOutput: {
      isOwner: [
        {
          fileId: 'id001sheets',
          fileName: 'mock_sheets_file1',
          fileType: 'application/vnd.google-apps.spreadsheet',
          owner: 'me@test.com',
          editors: ['sheetsTestEditor1@test.com', 'sheetsTextEditor2@test.com'],
          viewers: ['sheetsTestViewer1@test.app'],
        },
        {
          fileId: 'id003docs',
          fileName: 'mock_docs_file',
          fileType: 'application/vnd.google-apps.document',
          owner: 'me@test.com',
          editors: ['docsTestEditor1@test.com', 'docsTextEditor2@test.com'],
          viewers: ['docsTestViewer1@test.app'],
        },
        {
          fileId: 'id004slides',
          fileName: 'mock_slides_file',
          fileType: 'application/vnd.google-apps.presentation',
          owner: 'me@test.com',
          editors: ['slidesTestEditor1@test.com', 'slidesTextEditor2@test.com'],
          viewers: ['slidesTestViewer1@test.app'],
        },
        {
          fileId: 'id005form',
          fileName: 'mock_form_file',
          fileType: 'application/vnd.google-apps.form',
          owner: 'me@test.com',
          editors: ['formTestEditor1@test.com', 'formTextEditor2@test.com'],
          viewers: ['formTestViewer1@test.app'],
        },
        {
          fileId: 'id102subfolder',
          fileName: 'mock_subfolder',
          fileType: 'application/vnd.google-apps.folder',
          owner: 'me@test.com',
          editors: ['folderTestEditor1@test.com', 'folderTextEditor2@test.com'],
          viewers: ['folderTestViewer1@test.app'],
        },
      ],
      isNotOwner: [
        {
          fileId: 'id002sheets',
          fileName: 'mock_sheets_file2_not_owner',
          fileType: 'application/vnd.google-apps.spreadsheet',
          owner: 'someoneElse@test.com',
          editors: ['sheetsTestEditor1@test.com', 'sheetsTextEditor2@test.com'],
          viewers: ['sheetsTestViewer1@test.app'],
        },
      ],
    },
  },
];

patterns.forEach((pattern) => {
  test(pattern.testName, () => {
    expect(getFileUsers(pattern.input)).toEqual(pattern.expectedOutput);
  });
});

// Test error for unknown hostApp
test('Check getFileUsers: Unknown host app', () => {
  expect(() => {
    getFileUsers(EVENT_UNKNOWN_PLATFORM);
  }).toThrowError(
    new Error('[ERROR] Unshare is not available on this platform.')
  );
});
