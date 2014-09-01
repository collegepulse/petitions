Meteor.publish('posts', function (limit) {
  return Posts.find({}, { limit: limit, sort: {submitted: -1}});
});

Meteor.publish('postsWithResponses', function (limit) {
  return Posts.find({ response: { $exists: true, $ne : "" } }, { limit: limit, sort: {responded_at: -1}});
});

Meteor.publish('singlePost', function (id) {
  return id && Posts.find(id);
});

Meteor.publish('postsCount', function () {
  return PostsCount.find();
});

Meteor.publish('apiKeys', function () {
  return ApiKeys.find({userId: this.userId}, {fields: {created: 1, userId: 1}});
});

Meteor.publish('privilegedUsers', function () {
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    return Meteor.users.find({roles: {$in: ['admin', 'moderator']}});
  } else {
    this.stop();
    return;
  }
});

Meteor.publish('singleScore', function (postId) {
  return Scores.find({
    postId: postId, 
    created_at: { $gte: moment().startOf('day').subtract(1, 'week').valueOf() }
  }, {
    limit: 7,
    sort: {created_at: 1}
  });
});


Meteor.publish('signers', function (postId) {
  var post = Posts.findOne(postId);
  return Meteor.users.find({_id: {$in: post.upvoters}});
});