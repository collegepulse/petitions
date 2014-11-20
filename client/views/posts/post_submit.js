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

Template.postSubmit.rendered = function () {
  Deps.autorun(function () {
    $('#tags').select2({
      placeholder: "Petition Tags",
      data: {results: Tags.find().fetch()},
      multiple: true,
      maximumSelectionSize: 3,
      id: function (object) { return object._id; },
      matcher: function(term, text, option) { return option.name.toUpperCase().indexOf(term.toUpperCase()) > -1; },
      formatSelection: function (object, container) { return object.name.toUpperCase(); },
      formatResult: function (object, container, query) { return object.name; },
      formatNoMatches: function (object) { return "No tags found." },
      formatSelectionTooBig: function (object) { return "You can only select up to 3 tags." }
    });
    $('.select2-search-field>input').addClass("input");
  });
  // Accessing selected tags
  // $('#s2id_tags').select2('data');
};
