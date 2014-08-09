Handlebars.registerHelper('session', function (input) {
  return Session.get(input);
});

Handlebars.registerHelper('loggedIn', function () {
  return Meteor.user() != null;
});

Handlebars.registerHelper('breaklines', function (text) {
  text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
  return new Handlebars.SafeString(text);
});