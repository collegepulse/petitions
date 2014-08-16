Meteor.methods({
  editName: function(userAttributes) {

    var user = Meteor.user();
    
    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login to edit name preferences.");

    if (user.profile.displayName.toLowerCase() != userAttributes.profile.displayName.toLowerCase())
      throw new Meteor.Error(422, "Full name must use same spelling.");

    if (user.profile.givenName.toLowerCase() != userAttributes.profile.givenName.toLowerCase())
      throw new Meteor.Error(422, "First name must use same spelling.");

    if (user.profile.sn.toLowerCase() != userAttributes.profile.sn.toLowerCase())
      throw new Meteor.Error(422, "Last name must use same spelling.");

    Meteor.users.update({
      _id: user._id
    }, {
      $set: {
        'profile.displayName': userAttributes.profile.displayName,
        'profile.givenName': userAttributes.profile.givenName,
        'profile.sn': userAttributes.profile.sn
      }
    });
  },
  editUserRole: function(username, role, actionType) {

    var loggedInUser = Meteor.user();
    var action;

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin']))
      throw new Meteor.Error(403, "Access Denied.");

    if (actionType == 'add')
      action = {$addToSet: {roles: role}};
    else
      action = {$pull: {roles: role}};

    Meteor.users.update({username: username}, action);

  }
});