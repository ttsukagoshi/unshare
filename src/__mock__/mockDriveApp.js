const { MOCK_FILES } = require('./mockDriveFiles');

class MockDriveApp {
  /**
   * @param {String} id
   */
  static getFileById(id) {
    return new MockFile(MOCK_FILES[id]);
  }
}

class MockFile {
  constructor(fileObj) {
    this.id = fileObj.id;
    this.name = fileObj.name;
    this.owner = fileObj.users.owner;
    this.editors = fileObj.users.editors;
    this.viewers = fileObj.users.viewers;
    this.sheets = fileObj.sheets;
    this.mimeType = fileObj.mimeType;
  }
  /*
  getId() {
    return this.id;
  }
  */
  getName() {
    return this.name;
  }
  getOwner() {
    return new MockUser(this.owner);
  }
  getEditors() {
    return this.editors.map((editor) => new MockUser(editor));
  }
  getViewers() {
    return this.viewers.map((viewer) => new MockUser(viewer));
  }
  getMimeType() {
    return this.mimeType;
  }
}

class MockUser {
  /**
   * @param {String} email
   */
  constructor(email) {
    this.email = email;
  }
  getEmail() {
    return this.email;
  }
}

module.exports = { MockDriveApp, MockUser };
