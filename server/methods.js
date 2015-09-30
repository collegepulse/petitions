Meteor.methods({
  report: function(postId, reason) {

    var user = Meteor.user();

    if (!user)
      throw new Meteor.Error(401, "You need to login to report a petition.");

    if (!reason)
      throw new Meteor.Error(401, "You need to specify a reason for reporting the petition.");

    var petition = Posts.findOne(postId);

    if (petition) {

      this.unblock();

      Email.send({
        to: "sgweb@rit.edu",
        from: "sgnoreply@rit.edu",
        subject: "[petitions] Petition Reported",
        text: "Petition \"" + petition.title + "\" by " + petition.author + " was reported as " + reason + "."
      });
    }

  },
  changePendingPost: function(postId, approved, message){
    var user = Meteor.user()
    if (!Roles.userIsInRole(user, ['admin', 'moderator']))
      throw new Meteor.Error(403, "You are not authorized to approve this post.");

    var post = Posts.findOne(postId);
    Posts.update(postId, {$set: {pending: false}});
    var users = Meteor.users.find({_id: {$in: post.upvoters}},
                                  {fields: {username: 1}});
    var emails = users.map(function (user) { return user.username + "@rit.edu"; });
    if(approved){
      Posts.update(postId, {$set: {published: true,
        submitted: new Date().getTime()}});

        Email.send({
          bcc: emails,
          to: "sgnoreply@rit.edu",
          from: "sgnoreply@rit.edu",
          subject: "PawPrints - A petition you created has been approved",
          text: "Hello, \n\n" +
                "Petition \"" + post.title + "\" by " + post.author + " has been approved: \n\n" +
                Meteor.settings.public.root_url + "/petitions/" + post._id +
                "\n\nThanks, \nRIT Student Government"
        });
        return "Petition Approved!";

    }else{
      Email.send({
        bcc: emails,
        to: "sgnoreply@rit.edu",
        from: "sgnoreply@rit.edu",
        subject: "PawPrints - A petition you created has been rejected",
        text: "Hello, \n\n" +
              "Petition \"" + post.title + "\" by " + post.author + " has been rejected for the following reasons: \n\n" +
              message + "\n\nThanks, \nRIT Student Government"
      });  
      return "Petition Rejected.";
    }
  }
});
