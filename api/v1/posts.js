if (Meteor.isServer) {

  var setUser = function() {
    var token = this.query.key;
    if (token) {
      var encryptedToken = CryptoJS.MD5(token).toString();
      var apiKey = ApiKeys.findOne({token: encryptedToken});
      if (apiKey) {
        var user = Meteor.users.findOne({_id: apiKey.userId});
        return user && user._id;
      }
    }
  };

  HTTP.methods({
    '/v1/petitions': {
      auth: setUser,
      get: function(data) {
        if (this.userId) {
          this.setContentType('application/json');
          var limit = Math.min(parseInt(this.query.limit) || 500, 500);
          var posts = Posts.find({}, {fields: { title: 1,
                                                votes: 1,
                                                author: 1,
                                                description: 1,
                                                submitted: 1,
                                                response: 1,
                                                responded_at: 1,
                                                minimumVotes: 1}, limit: limit}).fetch();
          return JSON.stringify(posts);
        } else {
          this.setStatusCode(401);
        }
      }
    },
    '/v1/petitions/:petitionId': {
      auth: setUser,
      get: function(data) {
        if (this.userId) {
          var id = this.params.petitionId;
          var post = Posts.findOne(id, {fields: { title: 1,
                                                  votes: 1,
                                                  author: 1,
                                                  description: 1,
                                                  submitted: 1,
                                                  upvoters: 1,
                                                  response: 1,
                                                  responded_at: 1,
                                                  minimumVotes: 1}});
          if (post) {
            this.setContentType('application/json');
            post.signers = Meteor.users.find({'_id': {$in: post.upvoters}}).map(function (signer) { return signer.profile.initials });
            post.history = Scores.find({
                              postId: post._id, 
                              created_at: { $gte: moment().startOf('day').subtract(1, 'week').valueOf() }
                            }, {
                              fields: {
                                created_at: 1,
                                votes: 1
                              },
                              limit: 7,
                              sort: {created_at: 1}
                            }).fetch();
            delete post.upvoters;
            return JSON.stringify(post);
          } else
            this.setStatusCode(404);
        } else {
          this.setStatusCode(401);
        }
      }
    }
  });
}