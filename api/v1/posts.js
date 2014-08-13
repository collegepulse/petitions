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
          var limit = Math.min(parseInt(this.query.limit) || 500, 500);
          var posts = Posts.find({}, {fields: {title: 1, votes: 1}, limit: limit}).fetch();
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
          var post = Posts.findOne(id);
          if (post)
            return JSON.stringify(post);
          else
            this.setStatusCode(404);
        } else {
          this.setStatusCode(401);
        }
      }
    }
  });
}