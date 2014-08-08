Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

Router.map(function() {

  this.route('postPage', {
    path: '/posts/:_id',
    waitOn: function() {
      Meteor.subscribe('singlePost', this.params._id)
    },
    data: function() {
      return Posts.findOne(this.params._id);
    }
  });

  this.route('postSubmit', {
    path: '/submit'
  });

  this.route('postsList', {
    path: '/:postsLimit?',
    waitOn: function() {
      var postsLimit = parseInt(this.params.postsLimit) || 5;
      return Meteor.subscribe('posts', {sort: {submitted: -1}, limit: postsLimit });
    },
    data: function() {
      var limit = parseInt(this.params.postsLimit) || 5;
      return {
        posts: Posts.find({}, {sort: {submitted: -1}, limit: limit})
      };
    }
  });

});

var requireLogin = function(pause) {
  if (! Meteor.user()) {
    if (Meteor.loggingIn())
      this.render(this.loadingTemplate);
    else
      this.render('accessDenied');
    pause();
  }
}

Router.onBeforeAction('loading');
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});