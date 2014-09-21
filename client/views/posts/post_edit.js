Template.postEdit.events({
  'submit #petitionForm': function(e) {
    e.preventDefault();
    var postProperties = {
      title: $(e.target).find('[name=title]').val(),
      description: $(e.target).find('[name=description]').val(),
      response: $(e.target).find('[name=response]').val()
    };
    Meteor.call('edit', this.post._id, postProperties, function (err) {
      if (err) {
        GAnalytics.event("post", "edit", err.reason);
        throwError(err.reason);
      } else {
        throwError("Petition saved.");
        GAnalytics.event("post", "edit");
      }
    });
  },
  'click .delete-petition': function(e) {
    e.preventDefault();
    if (confirm("Delete this petition?")) {
      Meteor.call('delete', this.post._id, function (err) {
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