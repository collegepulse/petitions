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
})