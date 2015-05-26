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

  }
});