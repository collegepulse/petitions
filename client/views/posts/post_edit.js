Template.postEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    var currentPostId = this.post._id;
    var postProperties = {
      title: $(e.target).find('[name=title]').val(),
      description: $(e.target).find('[name=description]').val(),
      response: $(e.target).find('[name=response]').val(),
      status: $(e.target).find('[name=status] option:selected').val()
    }
    Meteor.call('edit', currentPostId, postProperties, function (err) {
      if (err) {
        GAnalytics.event("post", "edit", err.reason);
        throwError(err.reason);
      } else {
        GAnalytics.event("post", "edit");
        Router.go('postPage', {_id: currentPostId});
      }
    });
  },
  'click .delete': function(e) {
    e.preventDefault();
    var currentPostId = this.post._id;
    if (confirm("Delete this petition?")) {
      Meteor.call('delete', currentPostId, function (err) {
        if (err) {
          GAnalytics.event("post", "delete", err.reason);
          throwError(err.reason);
        } else {
          GAnalytics.event("post", "delete");
          Router.go('postsList');
        }
      });
    }
  }
});

Template.postEdit.helpers({
  is: function (val) {
    return this.post.status == val ? "selected" : "";
  }
});