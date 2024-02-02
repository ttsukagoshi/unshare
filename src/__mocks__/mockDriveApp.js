// eslint-disable-next-line @typescript-eslint/no-var-requires
const { MOCK_FILES } = require('./mockDriveFiles');

class MockDriveApp {
  static Access = {
    PRIVATE: 'PRIVATE',
  };
  static Permission = {
    VIEW: 'VIEW',
  };
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
    this.sharingStatus = {
      access: '',
      permission: '',
    };
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
  /**
   * @param {String} editor
   */
  removeEditor(editor) {
    this.editors = this.editors.filter((element) => element !== editor);
  }
  /**
   * @param {String} viewer
   */
  removeViewer(viewer) {
    this.viewers = this.viewers.filter((element) => element !== viewer);
  }
  /**
   * @param {String} access
   * @param {String} permission
   */
  setSharing(access, permission) {
    this.sharingStatus.access = access;
    this.sharingStatus.permission = permission;
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
