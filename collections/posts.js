Posts = new Meteor.Collection('posts');

Posts.initEasySearch(
  [ 'title', 'description', 'author' ],
  { 'limit' : 20 }
);

Meteor.methods({
  post: function(postAttributes) {
    var user = Meteor.user();

    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login to post a petition.");

    // ensure the post has a title
    if (!postAttributes.title)
      throw new Meteor.Error(422, 'Please fill in a \n title.');

    // ensure the post has a description
    if (!postAttributes.description)
      throw new Meteor.Error(422, 'Please fill in a description.');

    // pick out the whitelisted keys
    var post = _.extend(_.pick(postAttributes, 'title', 'description'), {
      userId: user._id,
      author: user.profile.displayName,
      submitted: new Date().getTime(),
      upvoters: [user._id],
      votes: 1
    });

    var postId = Posts.insert(post);

    PostsCount.update({}, {$inc: {count: 1}});

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

  }
});