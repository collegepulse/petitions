Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  onRun: function() {
    GAnalytics.pageview();
  },
  waitOn: function() {
    return [Meteor.subscribe('postsCount')];
  }
});

PostsCountController = RouteController.extend({
  data: function() {
    return {
      postsCount: PostsCount.findOne()
    };
  }
});

var infiniteScroll = function() {
  var didScroll = false,
      windowDom = $(window),
      documentDom = $(document);

  $(window).scroll(function() {
      didScroll = true;
  });

  setInterval(function() {
    if ( didScroll ) {
      didScroll = false;
      var atBottom = (windowDom.scrollTop() == documentDom.height() - windowDom.height());
      if (atBottom) {
        Session.set('postsLimit', Session.get('postsLimit') + 12);
      }
    }
  }, 500);
};

PostsListController = RouteController.extend({
  onBeforeAction: function() {
    Meteor.subscribe('posts', Session.get('postsLimit'));
    infiniteScroll();
  },
  data: function() {
    return {
      posts: Posts.find(),
      postsCount: PostsCount.findOne()
    };
  },
});

PostsWithResponsesController = RouteController.extend({
  onBeforeAction: function () {
    Meteor.subscribe('postsWithResponses', Session.get('postsLimit'));
    infiniteScroll();
  },
  data: function() {
    return {
      posts: Posts.find(),
      postsCount: PostsCount.findOne()
    };
  },
});

Router.map(function() {

  // Privileged Routes

  this.route('admin', {
    path: '/admin',
    template: 'admin',
    waitOn: function() {
      return [Meteor.subscribe('privilegedUsers')];
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
      return [Meteor.subscribe('apiKeys')]; 
    },
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
        setSEO("Submit Petition", "Submit a petition to Pawprints.")
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
        setSEO("Pawprints", "Pawprints is a place for sparking change at RIT. Share ideas with the RIT community and influence decision making.");
      }
    }
  });

  this.route('postsResponses', {
    path: '/petitions/responses',
    template: 'postsList',
    controller: PostsWithResponsesController,
    onAfterAction: function() {
      if (Meteor.isClient) {
        setSEO("Pawprints", "View petitions that have recieved responses from RIT Student Government and Administration.");
      }
    }
  });

  this.route('postPage', {
    path: '/petitions/:_id',
    template: 'postPage',
    waitOn: function() {
      return [Meteor.subscribe('singlePost', this.params._id),
              Meteor.subscribe('singleScore', this.params._id),
              Meteor.subscribe('signers', this.params._id)];
    },
    data: function() {
      return {
        post: Posts.findOne(this.params._id),
        postsCount: PostsCount.findOne(),
        scores: Scores.find().fetch(),
        url: window.location.origin + Router.current().path
      }
    },
    onAfterAction: function() {
      var data = Router.current().data();
      if (Meteor.isClient && data)
        setSEO(this.data().post.title, this.data().post.description);
      return; 
    }
  });

  this.route('postEdit', {
    path: '/petitions/:_id/edit',
    template: 'postEdit',
    waitOn: function () {
      return [Meteor.subscribe('singlePost', this.params._id)];
    },
    data: function() {
      return {
        post: Posts.findOne(this.params._id),
        postsCount: PostsCount.findOne()
      }
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
        setSEO("Moderation Policy", "Pawprints follows the RIT Code of Conduct for Computer and Network Use.");
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
    path: '/',
    template: 'index',
    controller: PostsListController,
    onAfterAction: function() {
      if (Meteor.isClient) {
        setSEO("Pawprints", "Pawprints is a place for sparking change at RIT. Share ideas with the RIT community and influence decision making.")
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
  Session.set("loginMsg", "");
}

Router.onBeforeAction('loading');
Router.onBeforeAction(clearErrors);
Router.onBeforeAction(requireLogin, {only: ['admin', 'postSubmit', 'userEdit']});
