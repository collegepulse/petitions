Posts = new Meteor.Collection('posts');

if (Meteor.isServer)
  Posts._ensureIndex({title: 1}, {unique: 1});

Posts.initEasySearch(
  [ 'title', 'description', 'author' ],
  {
    'limit' : 50,
    'use': 'mongo-db'
  }
);

var validatePostOnCreate = function validatePostOnCreate (postAttributes) {

  // ensure title is unique
  if (Posts.findOne({title: postAttributes.title}))
    throw new Meteor.Error(422, 'This title has already been used. Write a different one.');

};

var validatePost = function validatePost (postAttributes) {

  // ensure the user is logged in
  if (!Meteor.user())
    throw new Meteor.Error(401, "You need to login to do that.");

  // ensure the post has a title
  if (!postAttributes.title || !postAttributes.title.trim())
    throw new Meteor.Error(422, 'Please fill in a \n title.');

  var titleLength = postAttributes.title.length;
  if (titleLength > 70)
    throw new Meteor.Error(422, 'Title must not exceed 70 characters. Currently: ' + titleLength );

  // ensure the post has at least one tag
  if (!postAttributes.tag_ids || postAttributes.tag_ids.length == 0)
    throw new Meteor.Error(422, 'Please add at least one tag to the petition.');

  if (postAttributes.tag_ids.length > 3)
    throw new Meteor.Error(422, 'Petitions are limited to at most 3 tags.');

  // ensure the post has a description
  if (!postAttributes.description || !postAttributes.description.trim())
    throw new Meteor.Error(422, 'Please fill in a description.');

  var descriptionLength = postAttributes.title.length;
  if (descriptionLength > 4000)
    throw new Meteor.Error(422, 'Description must not exceed 4000 characters. Currently: ' + descriptionLength );
};

Meteor.methods({
  post: function(postAttributes) {

    validatePost(postAttributes);
    validatePostOnCreate(postAttributes);

    var user = Meteor.user();

    // pick out the whitelisted keys
    var post = _.extend(_.pick(postAttributes, 'title', 'description', 'tag_ids'), {
      userId: user._id,
      author: user.profile.name,
      submitted: new Date().getTime(),
      upvoters: [user._id],
      votes: 1,
      minimumVotes: Singleton.findOne().minimumThreshold
    });

    var postId = Posts.insert(post);

    Singleton.update({}, {$inc: {postsCount: 1}});

    return postId;
  },

  sign: function(postId) {
    var user = Meteor.user();

    if (!user)
      throw new Meteor.Error(401, "You need to login to sign a petition.");

    Posts.update({
      _id: postId,
      upvoters: {$ne: user._id}
    }, {
      $addToSet: {upvoters: user._id},
      $inc: {votes: 1}
    });

    var post = Posts.findOne(postId);

    if (post.votes === post.minimumVotes && Meteor.isServer) {
      var users = Meteor.users.find({roles: {$in: ['notify-threshold-reached']}});
      var emails = users.map(function (user) { return user.username + "@rit.edu"; });

      if (!_.isEmpty(emails)) {
        Email.send({
          to: emails,
          from: "sgnoreply@rit.edu",
          subject: "PawPrints - Petition Reaches Signature Threshold",
          text: "Petition \"" + post.title + "\" by " + post.author + " has reached its minimum signature goal: \n\n" +
                Meteor.settings.public.root_url + "/petitions/" + postId +
                "\n\nThanks, \nRIT Student Government"
        });
      }
    }

  },

  edit: function (postId, postAttributes) {

    var oldPost = Posts.findOne(postId, {
                    fields: { response: 1,
                              upvoters: 1,
                              author: 1 }});

    validatePost(postAttributes);

    var user = Meteor.user();

    if (!Roles.userIsInRole(user, ['admin', 'moderator']))
      throw new Meteor.Error(403, "You are not authorized to edit petitions.");

    // pick out the whitelisted keys
    var post = _.extend(_.pick(postAttributes, 'title', 'description', 'response', 'status', 'tag_ids'));

    if (_.isEmpty(post.response)) {
      delete post.response;
    } else {
      post.responded_at = new Date().getTime();
    }

    Posts.update(postId, {$set: post });

    if (_.isEmpty(oldPost.response) && !_.isEmpty(post.response)) {

      Posts.update(postId, {$set: {status: "responded"}});

      this.unblock();
      
      var users = Meteor.users.find({$and: [{'notify.response': true},
                                           {_id: {$in: oldPost.upvoters}}]},
                                    {fields: {username: 1}});

      var emails = users.map(function (user) { return user.username + "@rit.edu"; });

      Email.send({
        bcc: emails,
        to: "sgnoreply@rit.edu",
        from: "sgnoreply@rit.edu",
        subject: "PawPrints - A petition you signed has received a response",
        text: "Hello, \n\n" +
              "Petition \"" + post.title + "\" by " + oldPost.author + " has recieved a response: \n\n" +
              Meteor.settings.public.root_url + "/petitions/" + oldPost._id +
              "\n\nThanks, \nRIT Student Government"
      });
    }
  },
  delete: function (postId) {

    var user = Meteor.user();

    if (!Roles.userIsInRole(user, ['admin']))
      throw new Meteor.Error(403, "You are not authorized to delete petitions.");

    Posts.remove(postId);

    Singleton.update({}, {$inc: {postsCount: -1}});

  }
});