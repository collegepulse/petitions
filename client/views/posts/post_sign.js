Template.postSign.events({
  'submit form': function(e) {
    e.preventDefault();
    var _id = this.post._id;
    var sign = function () {
      Meteor.call('sign', _id, function(error) {
      if (error)
        throwError(error.reason);
      });
    }; 
    if (Meteor.userId()) {
      sign(); 
    } else {
      Session.set("loginMsg", "Please login to sign.");
      $('#loginModal').modal('show');
      $('#loginModal').on('hidden.bs.modal', function () {
        if (Meteor.userId())
          sign();
      });
    }
  }
});

Template.postSign.helpers({
  signedClass: function() {
    var userId = Meteor.userId();
    if (userId && this.post && _.include(this.post.upvoters, userId)) {
       return 'disabled';
    } else {
       return '';
    }
  }
});