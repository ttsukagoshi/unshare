const { MockUser } = require('./mockDriveApp');

class MockSession {
  static getActiveUser() {
    return new MockUser('me@test.com');
  }
}

module.exports = { MockSession };
