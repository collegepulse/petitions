Template.footer.events({
  'submit form': function (e) {
    e.preventDefault();
    var email = { email: $(e.target).find('[name=email]').val() };
    Meteor.call('email', email, function(error, id) {
      $('*[name=email]').val("");
      if (error) {
        $('*[name=email]').attr('placeholder', error.reason);
      } else {
        $('*[name=email]').attr('placeholder', 'Email added!');
        GAnalytics.event("email", "added");
      }
    });
  },
  'click .email-arrow': function (e) {
    e.preventDefault();
    var email = { email: $(e.target.parentElement.children[0]).val() };
    Meteor.call('email', email, function(error, id) {
      $('*[name=email]').val("");
      if (error) {
        $('*[name=email]').attr('placeholder', error.reason);
      } else {
        $('*[name=email]').attr('placeholder', 'Email added!');
        GAnalytics.event("email", "added");
      }
    });
  }
});