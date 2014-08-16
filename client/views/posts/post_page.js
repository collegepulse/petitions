var social_links = {
  'facebook': 'https://www.facebook.com/sharer/sharer.php?u=' + window.location.href,
  'twitter': 'https://twitter.com/intent/tweet?url=' + window.location.href,
  'reddit': 'http://www.reddit.com/submit?url=' + window.location.href,
  'plus': 'https://plus.google.com/share?url=' + window.location.href,
  'linkedin': 'https://www.linkedin.com/cws/share?url=' + window.location.href
}

var open = function open(url) {
  return window.open(url);
}

Template.postPage.events({
  'click *[social]': function (e) {
    var url = social_links[$(e.currentTarget).attr("social")];
    open(url);
  }
});