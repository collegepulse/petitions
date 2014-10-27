Meteor.startup(function () {
  Singleton.update({}, {$set: { version: "v1.1.2" }});
});
