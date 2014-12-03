Meteor.startup(function () {
  Singleton.update({}, {$set: { version: "v1.2.1.1-dev" }});
  process.env.MAIL_URL = Meteor.settings.MAIL_URL;
});
