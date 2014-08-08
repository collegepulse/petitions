Template.postSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    var post = {
      title: $(e.target).find('[name=title]').val(),
      description: $(e.target).find('[name=description]').val()
    }

    Meteor.call('post', post, function(error, id) {
      if (error)
        return alert(error.reason);
      Router.go('postPage', {_id: id});
    });
  }
});