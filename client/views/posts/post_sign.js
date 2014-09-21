Template.postSign.events({
  'submit form': function(e) {
    e.preventDefault();
    var post = this.post;
    var sign = function () {
      Meteor.call('sign', post._id, function(error) {
      if (error)
        throwError(error.reason);
      else {
        var signaturesNeeded = post.minimumVotes - post.votes;
        if (signaturesNeeded >= 1) {
          $('#postShareModal').modal('show');
        }
        $('.btn-sign').val("Signed");
      }
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
  },
  btnText: function() {
    var userId = Meteor.userId();
    if (userId && this.post && _.include(this.post.upvoters, userId)) {
      return 'Signed';
    } else {
      return 'Sign';
    }
  }
});
