Template.admin.events({
  'submit #thresholdForm': function (e) {
    e.preventDefault();

    var threshold = $(e.target).find('[name=minimumThreshold]').val();

    Meteor.call('changeMinimumThreshold', threshold, function (error) {
      if (error) {
        throwError(error.reason);
      } else {
        throwError("Minimum threshold changed.");
      }
    });
  },
  'submit form': function(e) {
    e.preventDefault();

    var usernameDOM = $(event.target).find('[name=username]'),
        username = usernameDOM.val(),
        role = $(event.target).find('[name=role]').val(),
        action = $(event.target).find('[name=action]').val();

    Meteor.call('editUserRole', username, role, action, function (error) {
      if (action === "add")
          usernameDOM.val("");
      if (error) {
        GAnalytics.event("account", "edit", error.reason);
        throwError(error.reason);
      } else {
        GAnalytics.event("account", "edit");
      }
    });
  }
});