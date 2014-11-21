Meteor.startup(function () {
  Singleton.update({}, {$set: { version: "v1.2.0" }});
});
