Template.admin.events({
  'submit form': function(e) {
    e.preventDefault();

    var usernameDOM = $(event.target).find('[name=username]'),
        username = usernameDOM.val(),
        role = $(event.target).find('[name=role]').val(),
        action = $(event.target).find('[name=action]').val();

    Meteor.call('editUserRole', username, role, action, function (error) {
      if (action === "add")
          usernameDOM.val("");
      if (error) 
        throwError(error.reason);
    });
  }
});