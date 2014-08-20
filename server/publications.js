Meteor.publish('posts', function (options) {
  return Posts.find({}, options);
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
    created_at: { $gte: moment().subtract(1, 'week').valueOf() }
  }, {
    limit: 7,
    sort: {created_at: -1}
  });
});