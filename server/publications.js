Meteor.publish('posts', function(options) {
  return Posts.find({}, options);
});

Posts.allow({
  insert: function(userId, doc) {
    // only allow posting if you are logged in
    return !! userId;
  }
});