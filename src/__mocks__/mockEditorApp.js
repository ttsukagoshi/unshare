// eslint-disable-next-line @typescript-eslint/no-var-requires
const { MOCK_FILES } = require('./mockDriveFiles');

////////////////////
// SpreadsheetApp //
////////////////////

class MockSpreadsheetApp {
  static getActiveSpreadsheet() {
    return new MockSpreadsheet(MOCK_FILES.id001sheets);
  }
  /*
  static openById(id) {
    return new MockSpreadsheet(MOCK_FILES[id]);
  }
  */
}

class MockSpreadsheet {
  /**
   * @param {Object} spreadsheetFileObj
   */
  constructor(spreadsheetFileObj) {
    this.id = spreadsheetFileObj.id;
    this.name = spreadsheetFileObj.name;
    this.sheets = spreadsheetFileObj.sheets;
  }
  getId() {
    return this.id;
  }
  /*
  getName() {
    return this.name;
  }
  */
}

/////////////////
// DocumentApp //
/////////////////

class MockDocumentApp {
  static getActiveDocument() {
    return new MockDocument(MOCK_FILES.id003docs);
  }
}

class MockDocument {
  constructor(documentFileObj) {
    this.id = documentFileObj.id;
    this.name = documentFileObj.name;
  }
  getId() {
    return this.id;
  }
  /*
  getName() {
    return this.name;
  }
  */
}

///////////////
// SlidesApp //
///////////////

class MockSlidesApp {
  static getActivePresentation() {
    return new MockSlide(MOCK_FILES.id004slides);
  }
}

class MockSlide {
  constructor(slideFileObj) {
    this.id = slideFileObj.id;
    this.name = slideFileObj.name;
  }
  getId() {
    return this.id;
  }
  /*
  getName() {
    return this.name;
  }
  */
}

module.exports = {
  MockSpreadsheetApp,
  MockDocumentApp,
  MockSlidesApp,
};
