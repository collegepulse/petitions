// Local (client-only) collection
Errors = new Meteor.Collection(null);

throwError = function(message) {
  Errors.remove({});
  Errors.insert({message: message})
};

Template.errors.events({
  'hidden.bs.modal': function (e, template) {
    Errors.remove({});
  }
});
