var findPosts = function (options) {
  var sort = {},
      selector = {};

  // configure sort parameters

  sort[options.sortBy] = -1;
  sort.submitted = -1;

  // configure query selector
  selector.status = {$in: [options.status]};
  if (options.tagName) {
    selector.tag_ids = {$in: [Tags.findOne({name: options.tagName})._id]}
  }
  if (!Roles.userIsInRole(options.userId, ['admin'])) {
    selector['published'] = true;
  }

  return Posts.find(selector, {
    limit: options.limit,
    sort: sort,
    fields: {
      author: 1,
      title: 1,
      votes: 1,
      submitted: 1,
      status: 1,
      tag_ids: 1
    }
  });
};

Meteor.publish('posts', function (limit, sortBy, tagName) {
  return findPosts({
    limit: limit,
    sortBy: sortBy,
    tagName: tagName,
    userId: this.userId
  });
});


Meteor.publish('postsInProgress', function (limit, sortBy, tagName) {
  return findPosts({
    limit: limit,
    sortBy: sortBy,
    tagName: tagName,
    status: "waiting-for-reply",
    userId: this.userId
  });
});

Meteor.publish('postsWithResponses', function (limit, sortBy, tagName) {
  return findPosts({
    limit: limit,
    sortBy: sortBy,
    tagName: tagName,
    status: "responded",
    userId: this.userId
  });
});

Meteor.publish('pendingPosts', function(){
  if (Roles.userIsInRole(this.userId, ['admin', 'moderator'])) {
    return Posts.find({pending: true});
  }else{
    this.stop();
    return;
  }
});

Meteor.publish('singlePost', function (id) {
  var selector = {};
  selector["_id"] = id;
  if ((!Roles.userIsInRole(this.userId, ['admin', 'moderator']))) {
    selector['published'] = true;
  }
  return Posts.find(selector, {
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
      status: 1,
      tag_ids: 1,
      published: 1,
      pending: 1
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
    return [];
  }
});

Meteor.publish('updates', function (postId) {
  return Updates.find(
    { postId: postId },
    { fields:
      {
        title: 1,
        description: 1,
        created_at: 1,
        author: 1
      }
    }
  );
});

Meteor.publish('tags', function () {
  return Tags.find({},{sort: {name: 1} } );
});

// Expose individual users' notification preferences
Meteor.publish(null, function() {
  return Meteor.users.find({_id: this.userId}, {fields: {'notify.updates': 1, 'notify.response': 1}});
});
