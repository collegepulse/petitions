Meteor.startup(function () {
  Singleton.update({}, {$set: { version: "v1.0.3-dev" }});
});
