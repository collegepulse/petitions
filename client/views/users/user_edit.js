Template.userEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var user = {
      profile: {
        displayName: $(e.target).find('[name=displayName]').val(),
        givenName: $(e.target).find('[name=givenName]').val(),
        sn: $(e.target).find('[name=sn]').val()
      }
    }

    Meteor.call('editName', user, function(error) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        throwError("Name preferences saved.");
      }
    });
  }
});