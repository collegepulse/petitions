Template.postSubmit.helpers({
  'emptyPost': function() {
    return {
      votes: 1,
      author: Meteor.user().profile.name,
      title: Session.get('post.title')
    }
  },
  'title': function() {
    return Session.get('post.title');
  },
  'author': function() {
    return Meteor.user().profile.displayName;
  }
});

Template.postSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    var post = {
      title: Session.get('post.title'),
      description: Session.get('post.description')
    }

    Meteor.call('post', post, function(error, id) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
        if (error.error === 302)
          Router.go('postPage', {_id: error.details})
      } else {
        Session.set('post.title', '');
        Session.set('post.description', '');
        Router.go('postPage', {_id: id});
      }
    });
  },
  'keyup *[name=title]': function (e) {
    Session.set('post.title', $('*[name=title]').val());
  },
  'keyup *[name=description]': function (e) {
    Session.set('post.description', $('textarea[name=description]').val());
  }
});