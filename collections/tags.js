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
  insert: function () { retiurn Roles.userIsInRole(Meteor.user(), ['admin']); },
  update: function () { return Roles.userIsInRole(Meteor.user(), ['admin']); }
});

// TagsFS = new FS.Collection('tagsFS', {
//   stores: [new FS.Store.FileSystem('tagsFS')]
// });

// TagsFS.allow({
//   insert:   function (userId, file) { return Roles.userIsInRole(userId, ['admin']); },
//   update:   function (userId, file) { return Roles.userIsInRole(userId, ['admin']); },
//   download: function () {return true; }
// });