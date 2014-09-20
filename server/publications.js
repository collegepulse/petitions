Meteor.publish('posts', function (limit, sortBy) {
  var sort = {};
  sort[sortBy] = -1;
  return Posts.find({}, {
    limit: limit,
    sort: sort,
    fields: {
      author: 1,
      title: 1,
      votes: 1,
      submitted: 1,
      status: 1
    }
  });
});

Meteor.publish('postsWithResponses', function (limit) {
  return Posts.find(
    { response: { $exists: true, $ne : "" } }, {
      limit: limit,
      sort: {responded_at: -1},
      fields: {
        author: 1,
        title: 1,
        votes: 1,
        submitted: 1,
        status: 1
      }
    });
});

Meteor.publish('singlePost', function (id) {
  return id && Posts.find(id, {
    fields: {
      author: 1,
      title: 1,
      description: 1,
      votes: 1,
      submitted: 1,
      response: 1,
      responded_at: 1,
      upvoters: 1,
      minimumVotes: 1,
      status: 1
    }
  });
});

Meteor.publish('singleton', function () {
  return Singleton.find();
});

Meteor.publish('apiKeys', function () {
  return ApiKeys.find({userId: this.userId}, {fields: {created: 1, userId: 1}});
});

Meteor.publish('privilegedUsers', function () {
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    return Meteor.users.find({roles: {$in: ['admin', 'moderator']}}, {
      fields: {
        username: 1,
        roles: 1,
        "profile.name": 1
      }
    });
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
  if (post) {
    return Meteor.users.find({_id: {$in: post.upvoters}}, {
      fields: {
        "profile.initials": 1
      }
    });
  } else {
    this.stop();
    return;
  }
});

Meteor.publish('updates', function (postId) {
  return Updates.find( {postId: postId},
    { fields: {
      title: 1,
      description: 1,
      created_at: 1,
      author: 1}
    }
  );
});

// Expose individual users' notification preferences 
Meteor.publish(null, function() {
  return Meteor.users.find({_id: this.userId}, {fields: {'notify.updates': 1, 'notify.response': 1}});
});