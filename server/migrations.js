Migrations = new Meteor.Collection('migrations');

Meteor.startup(function () {
  if (!Migrations.findOne({name: "addDefaultNotificationPreferences"})) {
    Meteor.users.find().forEach(function (user) {
      Meteor.users.update(user._id, {$set: {notify: {updates: false, response: true}}});
    });
    Migrations.insert({name: "addDefaultNotificationPreferences"});
  }
});