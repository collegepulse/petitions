Meteor.ldapLogin = function (username, password, callback) {
  return Accounts.callLoginMethod({
    methodArguments: [{username: username, password: password}],
    userCallback: callback
  });
};

Template.login.events({
  'submit form': function(event, template) {
    Session.set('loginError', null);
    event.preventDefault();
    return Meteor.ldapLogin(template.find('#username').value, template.find('#password').value, function (err, user) {
      if (err) {
        $(template.find('.modal-content')).shake(2,5,200);
      } else {
        $(template.find('#loginModal')).modal("hide");
        template.find('#username').value = "";
        template.find('#password').value = "";
      }
      return;
    });
  }
});

Template.header.events({
  'click #logout-button': function(event, template) {
    event.preventDefault();
    return Meteor.logout();
  }
});