Template.ritIdentityBar.helpers({
  'headerClass': function () {
    return Meteor.user() ? "hidden" : "visible-lg";
  }
});