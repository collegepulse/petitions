Meteor.methods({
  editUserRole: function(username, role, actionType) {
    var editingLocked;
    try {
        editingLocked = Meteor.settings.public.ui.roles_locked;
    }catch(Exception){
        editingLocked = false;
    }
    
    if(editingLocked)
      throw new Meteor.Error(403, "Roles are not editable.");

    var loggedInUser = Meteor.user();
    var action;

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin']))
      throw new Meteor.Error(403, "Access Denied.");

    if (actionType == 'add')
      action = {$addToSet: {roles: role}};
    else
      action = {$pull: {roles: role}};

    Meteor.users.update({username: username}, action);

  },
  editNotifications: function(notificationPrefs) {

    var user = Meteor.user();

    if (!user)
      throw new Meteor.Error(401, "You need to login to update notification preferences.");

    var notifyAttributes = _.pick(notificationPrefs, 'updates', 'response');

    if (typeof notifyAttributes.updates != "boolean" || typeof notifyAttributes.response != "boolean") {
      throw new Meteor.Error(422, 'Notification preferences could not be saved.');
    }
    
    Meteor.users.update(user._id, {$set: {notify: notifyAttributes}});
  }
});