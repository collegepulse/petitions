/**
  * Updates are status updates to petitions.
  *
  * They are the intermediary information that is relevant to a petition, but
  * not the final answer to the petitioner's request.
  *
  * Use cases include the formation of committees to investigate the petition
  * topic, scheduled meetings with administrators, and so forth.
  *
  **/

Updates = new Meteor.Collection('updates');

var validateUpdate = function (updateAttrs, post) {

  if (!updateAttrs.title || updateAttrs.title.length > 80)
    throw new Meteor.Error(422, "Title is longer than 80 characters or not present.");

  if (!updateAttrs.description || updateAttrs.description.length > 400)
    throw new Meteor.Error(422, "Description is longer than 400 characters or not present.");

  if (!updateAttrs.postId)
    throw new Meteor.Error(422, "The title's postId is missing.");

  if (post.status == "responded")
    throw new Meteor.Error(422, "Updates can't be added to petitions with responses.");

};

Meteor.methods({
  'createUpdate': function (updateAttrs) {

    var user = Meteor.user();

    if (!Roles.userIsInRole(user, ['admin', 'moderator']))
      throw new Meteor.Error(403, "You are not authorized to create updates.");

    var post = Posts.findOne(updateAttrs.postId);
    validateUpdate(updateAttrs, post);

    var existingUpdates = Updates.find({postId: updateAttrs.postId});

    if (_.isEmpty(post.response)) {

      Posts.update(updateAttrs.postId, {$set: {status: "waiting-for-reply"}});

      var users = Meteor.users.find({$and: [{'notify.updates': true},
                                           {_id: {$in: post.upvoters}}]},
                                    {fields: {username: 1}});
      
      var emails = users.map(function (user) { return user.username + "@rit.edu"; });

      Email.send({
        bcc: emails,
        to: "sgnoreply@rit.edu",
        from: "sgnoreply@rit.edu",
        subject: "PawPrints - A petition you signed has a status update",
        text: "Hello, \n\n" +
              "Petition \"" + post.title + "\" by " + post.author + " has a status update: \n\n" +
              Meteor.absoluteUrl("petitions/" + post._id) +
              "\n\nThanks, \nRIT Student Government"
      });

    }

    var update = _.extend(_.pick(updateAttrs, 'title', 'description', 'postId'), {
      created_at: new Date().getTime(),
      updated_at: new Date().getTime(),
      author: user.profile.name,
      userId: user._id
    });

    var updateId = Updates.insert(update);

  },
  'editUpdate': function (updateAttrs) {

    var user = Meteor.user();

    if (!Roles.userIsInRole(user, ['admin', 'moderator']))
      throw new Meteor.Error(403, "You are not authorized to edit updates.");

    validateUpdate(updateAttrs);

    var update = _.extend(_.pick(updateAttrs, 'title', 'description', 'postId'), {
      updated_at: new Date().getTime(),
      author: user.profile.name,
      userId: user._id
    });

    Updates.update(updateAttrs._id, {$set: update });
    
  },
  'deleteUpdate': function (updateAttrs) {

    var user = Meteor.user();

    if (!Roles.userIsInRole(user, ['admin', 'moderator']))
      throw new Meteor.Error(403, "You are not authorized to delete updates.");

    Updates.remove(updateAttrs._id);

  }
});
