Posts = new Meteor.Collection('posts');

if (Meteor.isServer)
  Posts._ensureIndex({title: 1}, {unique: 1});

Posts.initEasySearch(
  [ 'title', 'description', 'author' ],
  { 'limit' : 50 }
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
  if (!postAttributes.title)
    throw new Meteor.Error(422, 'Please fill in a \n title.');

  var titleLength = postAttributes.title.length;
  if (titleLength > 70)
    throw new Meteor.Error(422, 'Title must not exceed 70 characters. Currently: ' + titleLength );

  // ensure the post has a description
  if (!postAttributes.description)
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
    var post = _.extend(_.pick(postAttributes, 'title', 'description'), {
      userId: user._id,
      author: user.profile.displayName,
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

  },

  edit: function (postId, postAttributes) {

    validatePost(postAttributes);

    var user = Meteor.user();

    if (!Roles.userIsInRole(user, ['admin', 'moderator']))
      throw new Meteor.Error(403, "You are not authorized to edit petitions.");

    // pick out the whitelisted keys
    var post = _.extend(_.pick(postAttributes, 'title', 'description', 'response'));

    if (_.isEmpty(post.response)) {
      delete post.response;
    } else {
      post.responded_at = new Date().getTime();
    }

    Posts.update(postId, {$set: post });
  },
  delete: function (postId) {

    var user = Meteor.user();

    if (!Roles.userIsInRole(user, ['admin']))
      throw new Meteor.Error(403, "You are not authorized to delete petitions.");

    Posts.remove(postId);

  }
});