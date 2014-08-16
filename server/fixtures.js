if (Posts.find().count() === 0) {

  var peteId = Meteor.users.insert({
    username: 'pam3961',
    profile: {
      displayName: 'Pete Mikitsh',
      givenName: 'Pete',
      initials: 'PAM',
      sn: 'Mikitsh'
    }
  });
  var pete = Meteor.users.findOne(peteId);
  Roles.addUsersToRoles(peteId, ['admin']);

  Posts.insert({
    userId: pete._id,
    author: pete.profile.displayName,
    submitted: new Date().getTime(),
    title: "Build more affordable, on-campus housing.",
    description: "As there is only enough housing for half the student population, it creates a challenge to find affordably priced off-campus housing.",
    upvoters: [pete._id],
    votes: 1
  });

  Posts.insert({
    userId: pete._id,
    author: pete.profile.displayName,
    submitted: new Date().getTime(),
    title: "Extend hours for RIT Computer Labs at peak times.",
    description: "Students often work late near the end of semester; extended lab time will allow more students to utilize this on-campus resource.",
    upvoters: [pete._id],
    votes: 1
  });

  Posts.insert({
    userId: pete._id,
    author: pete.profile.displayName,
    submitted: new Date().getTime(),
    title: "Offer more options for students with unique dietary needs.",
    description: "Increase the number of options for vegan students at on-campus Dining Service locations.",
    upvoters: [pete._id],
    votes: 1
  });

  PostsCount.insert({
    count: Posts.find().count()
  });

}