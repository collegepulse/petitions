Meteor.publish('posts', function() {
  return Posts.find({});
});

Posts.allow({
  insert: function(userId, doc) {
    // only allow posting if you are logged in
    return !! userId;
  }
});