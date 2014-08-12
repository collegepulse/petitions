// Local (client-only) collection
Errors = new Meteor.Collection(null);

throwError = function(message) {
  Errors.remove({});
  Errors.insert({message: message})
}

clearError = function() {
  Errors.remove({});
}