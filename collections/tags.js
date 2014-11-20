/** Petition tags.
 *
 *  Structure: 
 *
 *    {
 *      "name":         <string>         tag name
 *      "tagsFS_ids":   [<mongo_id>]     id's of associated tag images
 *    }
 */

Tags = new Meteor.Collection('tags');

Tags.allow({
  insert: function () { return Roles.userIsInRole(Meteor.user(), ['admin']); },
  update: function () { return Roles.userIsInRole(Meteor.user(), ['admin']); }
});

var checkPermissions = function checkPermissions() {
  var user = Meteor.user()
  // ensure user is logged in
  if (!user)
    throw new Meteor.Error(401, "You need to login to do that.");
  // must be an admin to edit a tag
  if (!Roles.userIsInRole(user, ['admin']))
    throw new Meteor.Error(403, "You are not authorized to do that.");
};

var validateTag = function validateTag(tagAttributes) {
  // ensure the tag has a name
  if (!tagAttributes.name || !tagAttributes.name.trim())
    throw new Meteor.Error(422, 'Please fill in a \n name.');
};

Meteor.methods({
  createTag: function (tagAttributes) {
  	checkPermissions();
  	validateTag(tagAttributes);
  	var tag = _.pick(tagAttributes, 'name');
  	return Tags.insert(tag);
  },
  deleteTag: function (id) {
  	checkPermissions();
  	return Tags.remove(id);
  }
});

// TagsFS = new FS.Collection('tagsFS', {
//   stores: [new FS.Store.FileSystem('tagsFS')]
// });

// TagsFS.allow({
//   insert:   function (userId, file) { return Roles.userIsInRole(userId, ['admin']); },
//   update:   function (userId, file) { return Roles.userIsInRole(userId, ['admin']); },
//   download: function () {return true; }
// });