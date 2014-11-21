SyncedCron.add({
  name: 'Cache daily signature counts.',
  schedule: function (parser) {
    return parser.recur().on('00:00:00').time();
  }, 
  job: function() {

    // @petitions  <object>   petitions with no response submitted in the last year
    var petitions = Posts.find({
        response: { $exists: false },
        submitted: { $gte: moment().subtract(1, 'year').valueOf() }},
        {fields: {votes: 1, submitted: 1, score: 1}}).fetch();
    
    petitions.forEach(function (petition) {

      /**
       * @daysOld    <number>   number of days since petition created (floored)
       * @newScore   <number>   calculated use time decay formula
       * @newChange  <number>   day-over-day change in score
       */
      var daysOld = moment().diff(petition.submitted, 'days');
      var oldScore = petition.score || 0;
      var newScore = petition.votes / Math.pow(daysOld + 1, 1.5);
      var newChange = -1 * (oldScore - newScore); 

      Posts.update(
        petition._id,
        {$set: {score: newScore, change: newChange}}
      );

      Scores.insert({
        postId: petition._id,
        created_at: new Date().getTime(),
        score: newScore,
        votes: petition.votes
      });
    });

    return "Job done.";

  }
});

SyncedCron.start();