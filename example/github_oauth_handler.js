var JWT = require('jsonwebtoken'); // session stored as a JWT cookie

module.exports = function custom_handler(req, h, tokens, profile) {
  console.log(tokens, profile)
    return 1
}
