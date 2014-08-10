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

  Posts.insert({
    userId: pete._id,
    author: pete.profile.displayName,
    submitted: new Date().getTime(),
    title: "Build more affordable, on-campus housing.",
    description: "As there is only enough housing for half the student population, it creates a challenge to find affordably priced off-campus housing.",
    upvoters: [],
    votes: 0
  });

  Posts.insert({
    userId: pete._id,
    author: pete.profile.displayName,
    submitted: new Date().getTime(),
    title: "Extend hours for RIT Computer Labs at peak times.",
    description: "Students often work late near the end of semester; extended lab time will allow more students to utilize this on-campus resource.",
    upvoters: [],
    votes: 0
  });

  Posts.insert({
    userId: pete._id,
    author: pete.profile.displayName,
    submitted: new Date().getTime(),
    title: "Offer more options for students with unique dietary needs.",
    description: "Increase the number of options for vegan students at on-campus Dining Service locations.",
    upvoters: [],
    votes: 0
  });


}