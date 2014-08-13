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
  },
  'click .get-key': function (e) {
    e.preventDefault();
    Meteor.call('createApiKey', function(error, key) {
      Session.set('apiKey', key);
    });
  }
});

Template.apiKeys.helpers({
  'hasOldKey': function() {
    return ApiKeys.find().fetch().length >= 1 && typeof Session.get('apiKey') === 'undefined';
  },
  'hasNoKey': function() {
    return ApiKeys.find().fetch().length == 0;
  },
  sessionKeyExists: function() {
    return typeof Session.get('apiKey') != 'undefined';
  },
  key: function() {
    return Session.get('apiKey');
  }
});