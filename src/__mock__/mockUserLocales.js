const { MESSAGES } = require('../unshare');
let mockMessages = MESSAGES;
mockMessages['xx'] = {};
const MOCK_USER_LOCALES = Object.keys(mockMessages).concat(['en-GB', 'zz']);

module.exports = { MOCK_USER_LOCALES };
