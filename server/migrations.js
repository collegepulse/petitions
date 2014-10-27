Migrations = new Meteor.Collection('migrations');

Meteor.startup(function () {
  if (!Migrations.findOne({name: "addDefaultNotificationPreferences"})) {
    Meteor.users.find().forEach(function (user) {
      Meteor.users.update(user._id, {$set: {notify: {updates: false, response: true}}});
    });
    Migrations.insert({name: "addDefaultNotificationPreferences"});
  }
  // only necessary if upgrading from <=v1.1.1 to a newer release
  if (!Migrations.findOne({name: "ensureProfilePropertyExistsForUsers"})) {
    Meteor.users.find().forEach(function (user) {
      if (!user.profile) {
        Meteor.users.update(user._id, {$set: { profile: {
          displayName: null,
          givenName: null,
          initials: null,
          sn: null,
          name: null
        }}});
      }  
    });
    Migrations.insert({name: "ensureProfilePropertyExistsForUsers"});
  }
});