const { buildConfirmationPage } = require('../src/unshare');
const {
  EVENT_DRIVE_SELECTED,
  EVENT_SHEETS,
  EVENT_DRIVE_SELECTED_NOT_OWNER_FILE,
} = require('../src/__mocks__/mockEvents');

const patterns = [
  {
    testName: 'Check buildConfirmationPage: files selected on Drive',
    input: EVENT_DRIVE_SELECTED,
    expectedOutput: {
      sections: [
        {
          widgets: [
            {
              // localizedMessage.replaceConfirmationMessage(targetFilesSummary, ignoredFilesSummary)
              // localizedMessage.messageList.userAccessEditor
              // localizedMessage.messageList.userAccessViewer
              // localizedMessage.messageList.userAccessCommenter
              text: 'Are you sure you want to proceed with Unshare? You will be permanently removing all editors and viewers (including commenters) from these file/folder(s):\n<b>mock_sheets_file1</b>\n - sheetsTestEditor1@test.com (editor)\n - sheetsTextEditor2@test.com (editor)\n - sheetsTestViewer1@test.app (viewer/commenter)\n\n<b>mock_docs_file</b>\n - docsTestEditor1@test.com (editor)\n - docsTextEditor2@test.com (editor)\n - docsTestViewer1@test.app (viewer/commenter)\n\n<b>mock_slides_file</b>\n - slidesTestEditor1@test.com (editor)\n - slidesTextEditor2@test.com (editor)\n - slidesTestViewer1@test.app (viewer/commenter)\n\n<b>mock_form_file</b>\n - formTestEditor1@test.com (editor)\n - formTextEditor2@test.com (editor)\n - formTestViewer1@test.app (viewer/commenter)\n\n<b>mock_subfolder</b>\n - folderTestEditor1@test.com (editor)\n - folderTextEditor2@test.com (editor)\n - folderTestViewer1@test.app (viewer/commenter)\n\n<b>THIS ACTION CANNOT BE UNDONE</b>.\n\nNote that the file/folder(s) below will be ignored since you are not the owner:\n * mock_sheets_file2_not_owner',
            },
          ],
        },
      ],
      fixedFooter: {
        primaryButton: {
          text: 'CANCEL', // localizedMessage.messageList.buttonCancel
          textButtonStyle: 'FILLED',
          onClickAction: { functionName: 'buildDriveHomepage' },
          openLink: '',
        },
        secondaryButton: {
          text: 'UNSHARE', // localizedMessage.messageList.buttonExecuteUnshare
          textButtonStyle: '',
          onClickAction: { functionName: 'unshare' },
          openLink: '',
        },
      },
    },
  },
  {
    testName: 'Check buildConfirmationPage: Sheet file with owner privilege',
    input: EVENT_SHEETS,
    expectedOutput: {
      sections: [
        {
          widgets: [
            {
              // localizedMessage.replaceConfirmationMessage(targetFilesSummary, ignoredFilesSummary)
              // localizedMessage.messageList.userAccessEditor
              // localizedMessage.messageList.userAccessViewer
              // localizedMessage.messageList.userAccessCommenter
              text: 'Are you sure you want to proceed with Unshare? You will be permanently removing all editors and viewers (including commenters) from these file/folder(s):\n<b>mock_sheets_file1</b>\n - sheetsTestEditor1@test.com (editor)\n - sheetsTextEditor2@test.com (editor)\n - sheetsTestViewer1@test.app (viewer/commenter)\n\n<b>THIS ACTION CANNOT BE UNDONE</b>.\n\n',
            },
          ],
        },
      ],
      fixedFooter: {
        primaryButton: {
          text: 'CANCEL', // localizedMessage.messageList.buttonCancel
          textButtonStyle: 'FILLED',
          onClickAction: { functionName: 'buildHomepage' },
          openLink: '',
        },
        secondaryButton: {
          text: 'UNSHARE', // localizedMessage.messageList.buttonExecuteUnshare
          textButtonStyle: '',
          onClickAction: { functionName: 'unshare' },
          openLink: '',
        },
      },
    },
  },
  {
    testName: 'Check buildConfirmationPage: not-owner file selected on Drive',
    input: EVENT_DRIVE_SELECTED_NOT_OWNER_FILE,
    expectedOutput: {
      sections: [
        {
          widgets: [
            {
              text: '[ERROR] You must be the owner of the file/folder(s) to execute Unshare:\n * mock_sheets_file2_not_owner',
            },
          ],
        },
      ],
      fixedFooter: {
        primaryButton: {
          text: 'Return Home', // localizedMessage.messageList.buttonReturnHome
          textButtonStyle: 'FILLED',
          onClickAction: { functionName: 'buildDriveHomepage' },
          openLink: '',
        },
        secondaryButton: {},
      },
    },
  },
];

patterns.forEach((pattern) => {
  test(pattern.testName, () => {
    expect(buildConfirmationPage(pattern.input)).toEqual(
      pattern.expectedOutput
    );
  });
});
