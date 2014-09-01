Template.postEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    var currentPostId = this.post._id;
    var postProperties = {
      title: $(e.target).find('[name=title]').val(),
      description: $(e.target).find('[name=description]').val(),
      response: $(e.target).find('[name=response]').val()
    }
    Meteor.call('edit', currentPostId, postProperties, function (err) {
      if (err) {
        throwError(err.reason);
      } else {
        Router.go('postPage', {_id: currentPostId});
      }
    });
  },
  'click .delete': function(e) {
    e.preventDefault();
    if (confirm("Delete this post?")) {
      var currentPostId = this._id;
      Posts.remove(currentPostId);
      Router.go('postsList');
    }
  }
});