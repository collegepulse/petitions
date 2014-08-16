Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

PostsCountController = RouteController.extend({
  waitOn: function() {
    return [Meteor.subscribe('postsCount')];
  },
  data: function() {
    return {
      postsCount: PostsCount.findOne()
    };
  }
});

PostsListController = RouteController.extend({
  increment: 5,
  limit: function() {
    return parseInt(this.params.postsLimit) || this.increment; },
  findOptions: function() {
    return {sort: {submitted: -1}, limit: this.limit()}; },
  waitOn: function() {
    return [Meteor.subscribe('postsCount'), Meteor.subscribe('posts', this.findOptions())]; },
  data: function() {
    return {
      posts: Posts.find({}, this.findOptions()),
      postsCount: PostsCount.findOne()
    };
  }
});

Router.map(function() {

  // Privileged Routes

  this.route('admin', {
    path: '/admin',
    template: 'admin',
    waitOn: function() {
      return [Meteor.subscribe('privilegedUsers'), Meteor.subscribe('postsCount')];
    },
    data: function() {
      return {
        admins: Meteor.users.find({roles: {$in: ['admin']}}),
        moderators: Meteor.users.find({roles: {$in: ['moderator']}}),
        postsCount: PostsCount.findOne()
      };
    }
  });

  // User Routes

  this.route('userEdit', {
    path: '/users/edit',
    waitOn: function() {
      return [Meteor.subscribe('postsCount'), Meteor.subscribe('apiKeys')]; },
    data: function() {
      return {
        user: Meteor.user(),
        apiKeys: ApiKeys.findOne(),
        postsCount: PostsCount.findOne()
      };
    }
  });

  // Post Routes

  this.route('postSubmit', {
    path: '/petitions/create',
    onAfterAction: function() {
      if (Meteor.isClient) {
        setSEO("Submit Petition", "Submit a petition to Petition SG.")
      }
    },
    controller: PostsCountController
  });

  this.route('postsList', {
    path: '/petitions/list',
    template: 'postsList',
    controller: PostsListController,
    onAfterAction: function() {
      if (Meteor.isClient) {
        setSEO("Petition SG", "Petition SG is a place for sparking change at RIT. Share ideas with the RIT community and influence decision making.");
      }
    }
  });

  this.route('postPage', {
    path: '/petitions/:_id',
    template: 'postPage',
    waitOn: function() {
      return [Meteor.subscribe('postsCount'), Meteor.subscribe('singlePost', this.params._id)]
    },
    data: function() {
      return {
        post: Posts.findOne(this.params._id),
        postsCount: PostsCount.findOne()
      }
    },
    onAfterAction: function() {
      var data = Router.current().data();
      if (Meteor.isClient && data)
        setSEO(this.data().title, this.data().description);
      return; 
    }
  });

  // Static routes

  this.route('api', {
    path: '/api-access',
    template: 'api',
    controller: PostsCountController,
    onAfterAction: function() {
      if (Meteor.isClient) {
        setSEO("API Access", "Student Government provides a read-only JSON REST API for retreiving petition information.");   
      }
    }
  });

  this.route('moderation', {
    path: '/moderation',
    template: 'moderation',
    controller: PostsCountController,
    onAfterAction: function() {
      if (Meteor.isClient) {
        setSEO("Moderation Policy", "Petition SG follows the RIT Code of Conduct for Computer and Network Use.");
      }
    }
  });

  this.route('petitionProcess', {
    path: '/petition-process',
    template: 'petitionProcess',
    controller: PostsCountController,
    onAfterAction: function() {
      if (Meteor.isClient) {
        setSEO("Petition Process", "Learn how to effectively create a successful petition.");
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
};

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
};

var clearErrors = function() {
  Errors.remove({});
}

Router.onBeforeAction('loading');
Router.onBeforeAction(clearErrors);
Router.onBeforeAction(requireLogin, {only: ['admin', 'postSubmit', 'userEdit']});