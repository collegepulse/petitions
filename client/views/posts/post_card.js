Template.postCard.events({
  'submit form': function(e) {
    e.preventDefault();

    var _id = $(e.target).find('[name=_id]').val();

    Meteor.call('sign', _id, function(error) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
        if (error.error === 302)
          Router.go('postPage', {_id: error.details})
      } else {
        Router.go('postPage', {_id: id});
      }
    });
  }
});

Template.postCard.helpers({
  signedClass: function() {
    var userId = Meteor.userId();
    if (userId && !_.include(this.upvoters, userId)) {
       return '';
    } else {
       return 'disabled';
    }
  }
});