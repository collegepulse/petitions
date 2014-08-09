Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

PostsListController = RouteController.extend({
  increment: 5,
  limit: function() {
    return parseInt(this.params.postsLimit) || this.increment; },
  findOptions: function() {
    return {sort: {submitted: -1}, limit: this.limit()};
  },
  waitOn: function() {
    return Meteor.subscribe('posts', this.findOptions()); },
  data: function() {
    return {posts: Posts.find({}, this.findOptions())};
  }
});

Router.map(function() {

  this.route('postPage', {
    path: '/posts/:_id',
    template: 'postPage',
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
    path: '/petitions/:postsLimit?',
    template: 'postsList',
    controller: PostsListController
  });

  // Must be last route (catch-all)

  this.route('index', {
    path: '/:postsLimit?',
    template: 'index',
    controller: PostsListController
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