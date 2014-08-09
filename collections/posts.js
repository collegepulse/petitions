Posts = new Meteor.Collection('posts');

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
      submitted: new Date().getTime()
    });

    var postId = Posts.insert(post);
    return postId;
  }
});

if (Meteor.isServer) {
  Meteor.startup(function () {

    collectionApi = new CollectionAPI({
      apiPath: 'api'
    });

    collectionApi.addCollection(Posts, 'posts', {
      methods: ['GET']
    });

    collectionApi.start();
  });
}