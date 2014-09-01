var social_links = {
  'facebook': 'https://www.facebook.com/sharer/sharer.php?u=',
  'twitter': 'https://twitter.com/intent/tweet?url=',
  'reddit': 'http://www.reddit.com/submit?url=',
  'plus': 'https://plus.google.com/share?url=',
  'linkedin': 'https://www.linkedin.com/cws/share?url='
};

var timeTick = new Deps.Dependency();

Meteor.setInterval(function () {
  timeTick.changed();
}, 1000);


Template.postPage.helpers({
  'responded_at': function () {
    timeTick.depend();
    return new moment(this.post.responded_at).fromNow().toUpperCase();
  },
  'submitted_at': function () {
    timeTick.depend();
    return new moment(this.post.submitted).fromNow().toUpperCase();
  }
});

Template.postPage.events({
  'click *[social]': function (e) {
    var url = social_links[$(e.currentTarget).attr("social")] + this.url;
    window.open(url);
  }
});