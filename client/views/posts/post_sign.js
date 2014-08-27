Template.postSign.events({
  'submit form': function(e) {
    e.preventDefault();

    var _id = this.post._id;

    Meteor.call('sign', _id, function(error) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
        if (error.error === 302)
          Router.go('postPage', {_id: error.details})
      } else {
        Router.go('postPage', {_id: _id});
      }
    });
  }
});

Template.postSign.helpers({
  signedClass: function() {
    var userId = Meteor.userId();
    if (userId && this.post && !_.include(this.post.upvoters, userId)) {
       return '';
    } else {
       return 'disabled';
    }
  }
});