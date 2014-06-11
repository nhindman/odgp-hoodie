define(function(require, exports, module) {

  var BASE_URL = 'https://burning-fire-4148.firebaseio.com';
  var chatRef = new Firebase(BASE_URL);
  var error = null;
  module.exports.user = null;

  module.exports.auth = new FirebaseSimpleLogin(chatRef, function(error, user) {
     if (error) {
          // an error occurred while attempting login
          console.log(error);
        } else if (user) {
          // user authenticated with Firebase
          module.exports.user = user;
          console.log('User ID: ' + user.uid + ', Provider: ' + user.provider);
        } else {
          console.log('user logged out');
          module.exports.user = null
          // user is logged out
        }
  });
});