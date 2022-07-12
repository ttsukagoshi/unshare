const MOCK_FILES = {
  id001sheets: {
    id: 'id001sheets',
    name: 'mock_sheets_file1',
    users: {
      owner: 'me@test.com',
      editors: ['sheetsTestEditor1@test.com', 'sheetsTextEditor2@test.com'],
      viewers: ['sheetsTestViewer1@test.app'],
    },
    folderId: 'id101folder',
    mimeType: 'application/vnd.google-apps.spreadsheet',
    sheets: [
      {
        sheetName: 'Sheet 1',
      },
    ],
  },
  id002sheets: {
    id: 'id002sheets',
    name: 'mock_sheets_file2_not_owner',
    users: {
      owner: 'someoneElse@test.com',
      editors: ['sheetsTestEditor1@test.com', 'sheetsTextEditor2@test.com'],
      viewers: ['sheetsTestViewer1@test.app'],
    },
    folderId: 'id101folder',
    mimeType: 'application/vnd.google-apps.spreadsheet',
    sheets: [
      {
        sheetName: 'Sheet 1',
      },
    ],
  },
  id003docs: {
    id: 'id003docs',
    name: 'mock_docs_file',
    users: {
      owner: 'me@test.com',
      editors: ['docsTestEditor1@test.com', 'docsTextEditor2@test.com'],
      viewers: ['docsTestViewer1@test.app'],
    },
    folderId: 'id101folder',
    mimeType: 'application/vnd.google-apps.document',
    docs: {},
  },
  id004slides: {
    id: 'id004slides',
    name: 'mock_slides_file',
    users: {
      owner: 'me@test.com',
      editors: ['slidesTestEditor1@test.com', 'slidesTextEditor2@test.com'],
      viewers: ['slidesTestViewer1@test.app'],
    },
    folderId: 'id101folder',
    mimeType: 'application/vnd.google-apps.presentation',
    slides: {},
  },
  id005form: {
    id: 'id005form',
    name: 'mock_form_file',
    users: {
      owner: 'me@test.com',
      editors: ['formTestEditor1@test.com', 'formTextEditor2@test.com'],
      viewers: ['formTestViewer1@test.app'],
    },
    folderId: 'id101folder',
    mimeType: 'application/vnd.google-apps.form',
    form: {},
  },
  id102subfolder: {
    id: 'id102subfolder',
    name: 'mock_subfolder',
    users: {
      owner: 'me@test.com',
      editors: ['folderTestEditor1@test.com', 'folderTextEditor2@test.com'],
      viewers: ['folderTestViewer1@test.app'],
    },
    folderId: 'id101folder',
    mimeType: 'application/vnd.google-apps.folder',
    files: [],
  },
};

module.exports = { MOCK_FILES };
