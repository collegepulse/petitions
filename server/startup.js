Meteor.startup(function () {
  Singleton.update({}, {$set: { version: "v1.2.2.1" }});
  process.env.MAIL_URL = Meteor.settings.MAIL_URL;
});
