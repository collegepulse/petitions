Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

PostsListController = RouteController.extend({
  increment: 5,
  limit: function() {
    return parseInt(this.params.postsLimit) || this.increment; },
  findOptions: function() {
    return {sort: {submitted: -1}, limit: this.limit()}; },
  waitOn: function() {
    return Meteor.subscribe('posts', this.findOptions()); },
  data: function() {
    return {posts: Posts.find({}, this.findOptions())}; }
});

Router.map(function() {

  this.route('postSubmit', {
    path: '/petitions/create',
    onAfterAction: function() {
      if (Meteor.isClient) {
        setSEO("Submit Petition", "Submit a petition to Petition SG.")
      }
    }
  });

  this.route('postsList', {
    path: '/petitions/list',
    template: 'postsList',
    controller: PostsListController,
    onAfterAction: function() {
      if (Meteor.isClient) {
        setSEO("Petition SG", "Petition SG is a place for sparking change at RIT. Share ideas with the RIT community and influence decision making.")
      }
    }
  });

  this.route('postPage', {
    path: '/petitions/:_id',
    template: 'postPage',
    waitOn: function() {
      Meteor.subscribe('singlePost', this.params._id)
    },
    data: function() {
      return Posts.findOne(this.params._id);
    },
    onAfterAction: function() {
      var data = Router.current().data();
      if (Meteor.isClient && data)
        setSEO(this.data().title, this.data().description);
      return; 
    }
  });


  this.route('api', {
    path: '/api-access',
    template: 'api',
    onAfterAction: function() {
      if (Meteor.isClient) {
        setSEO("API Access", "Student Government provides a read-only JSON REST API for retreiving petition information.");   
      }
    }
  });

  // Must be last route (catch-all)

  this.route('index', {
    path: '/:postsLimit?',
    template: 'index',
    controller: PostsListController,
    onAfterAction: function() {
      if (Meteor.isClient) {
        setSEO("Petition SG", "Petition SG is a place for sparking change at RIT. Share ideas with the RIT community and influence decision making.")
      }
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

var setSEO = function(title, description) {
  SEO.set({
    title: title,
    meta: {
      'description': description
    },
    og: {
      'title': title,
      'description': description
    }
  });
}

Router.onBeforeAction('loading');
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});