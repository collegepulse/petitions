Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  onRun: function () {
    Deps.nonreactive(function() {
      ga('send', 'pageview', Router.current().url);
    });
    this.next();
  },
  waitOn: function () {
    return [Meteor.subscribe('singleton'), Meteor.subscribe('tags')];
  },
  onAfterAction: function () {
    if (Errors.find().fetch().length > 0) {
      $('#errorModal').modal('show');
    }
  }
});

var postSort = function() {
  var sort = {};
  sort[Session.get('postOrder')] = -1;
  sort.submitted = -1;
  return {
    posts: Posts.find({}, {sort: sort}).fetch(),
    postOrder: Session.get('postOrder'),
    tag: Session.get('tagName')
  };
};

PostsListController = RouteController.extend({
  onBeforeAction: function() {
    Meteor.subscribe('posts', Session.get('postsLimit'), Session.get('postOrder'), this.params.tagName);
    infiniteScroll();
    this.next();
  },
  data: postSort
});

PostsWithResponsesController = RouteController.extend({
  onBeforeAction: function () {
    Meteor.subscribe('postsWithResponses', Session.get('postsLimit'), Session.get('postOrder'));
    infiniteScroll();
    this.next();
  },
  data: postSort
});

PostsInProgressController = RouteController.extend({
  onBeforeAction: function () {
    Meteor.subscribe('postsInProgress', Session.get('postsLimit'), Session.get('postOrder'));
    infiniteScroll();
    this.next();
  },
  data: postSort
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
        notifiers: Meteor.users.find({roles: {$in: ['notify-threshold-reached']}}),
        tags: Tags.find().fetch()
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
        apiKeys: ApiKeys.findOne()
      };
    }
  });

  // Post Routes

  this.route('postSubmit', {
    path: '/petitions/create'
  });

  this.route('postsList', {
    path: '/petitions/list',
    template: 'postsList',
    controller: PostsListController
  });

  this.route('postsInProgress', {
    path: '/petitions/in-progress',
    template: 'postsInProgressList',
    controller: PostsInProgressController
  });

  this.route('postsResponses', {
    path: '/petitions/responses',
    template: 'postsWithResponsesList',
    controller: PostsWithResponsesController
  });

  this.route('postsTagList', {
    path: '/petitions/tagged/:tagName',
    template: 'postsTagList',
    onBeforeAction: function () {
      infiniteScroll();
      Session.set('tagName', this.params.tagName);
      Meteor.subscribe('posts', Session.get('postsLimit'), Session.get('postOrder'), Session.get('tagName'));
      this.next();
    },
    data: postSort,
    onAfterAction: function() {
      setSEO({title: Session.get('tagName') + " Petitions",
              description: "View " + Session.get('tagName') + " petitions on PawPrints."});
      return; 
    }
  });

  this.route('postPage', {
    path: '/petitions/:_id',
    template: 'postPage',
    waitOn: function() {
      return [Meteor.subscribe('singlePost', this.params._id),
              Meteor.subscribe('signers', this.params._id),
              Meteor.subscribe('updates', this.params._id)];
    },
    data: function() {
      return {
        post: Posts.findOne(),
        updates: Updates.find({}, {sort: {created_at: 1}}).fetch(),
        scores: Scores.find().fetch(),
        url: window.location.href
      }
    },
    onAfterAction: function() {
      if (this.data().post)
        setSEO({title: this.data().post.title, description: this.data().post.description});
      return; 
    }
  });

  this.route('postEdit', {
    path: '/petitions/:_id/edit',
    template: 'postEdit',
    onBeforeAction: function () {
      if (Meteor.user() && !_.contains(Meteor.user().roles, "moderator") && !_.contains(Meteor.user().roles, "admin"))
        this.render('pageNotFound');
        this.next();
    },
    waitOn: function () {
      return [Meteor.subscribe('singlePost', this.params._id),
              Meteor.subscribe('updates', this.params._id)];
    },
    data: function() {
      var post = Posts.findOne(this.params._id);
      if (this.ready() && !post)
        this.render('pageNotFound');
      else
        return {
          post: Posts.findOne(this.params._id),
          updates: Updates.find({}, {sort: {created_at: 1}}).fetch(),
          newUpdate: {},
          user: Meteor.user()
        }
    }
  });

  // Static routes

  this.route('about', {
    path: '/about',
    template: 'aboutTemplate',
    data: function () {
      return {
        subtemplate: 'about'
      };
    }
  });

  this.route('api', {
    path: '/api-access',
    template: 'aboutTemplate',
    data: function () {
      return {
        subtemplate: 'api'
      };
    }
  });

  this.route('moderation', {
    path: '/moderation',
    template: 'aboutTemplate',
    data: function () {
      return {
        subtemplate: 'moderation'
      };
    }
  });

  this.route('petitionProcess', {
    path: '/petition-process',
    template: 'aboutTemplate',
    data: function () {
      return {
        subtemplate: 'petitionProcess'
      };
    }
  });

  // Must be last route (catch-all)

  this.route('index', {
    path: '/',
    template: 'index',
    controller: PostsListController
  });

  this.route('pageNotFound', {
    path: '/*',
    onRun: function () {
      this.render('pageNotFound');
    }
  });


});

var requireLogin = function() {
  if (!Meteor.user()) {
    if (Meteor.loggingIn())
      this.render(this.loadingTemplate);
    else
      this.render('accessDenied');
  } else {
    this.next();
  }
};

var clearLoginMsg = function() {
  Session.set("loginMsg", "");
}

Router.onBeforeAction('loading');
Router.onAfterAction(clearLoginMsg);
Router.onBeforeAction(requireLogin, {only: ['admin', 'postSubmit', 'userEdit', 'postEdit']});
