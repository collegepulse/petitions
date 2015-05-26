Template.userEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var notificationPrefs = {
      updates: $(e.target).find('[name=notifyUpdates]').is(':checked'),
      response: $(e.target).find('[name=notifyResponse]').is(':checked')
    };

    Meteor.call('editNotifications', notificationPrefs, function(error) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        throwError("Notification preferences saved.");
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