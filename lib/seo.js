var seoData = {
  admin: {
    title: "Admin",
    description: "Change administrative settings."
  },
  userEdit: {
    title: "Profile",
    description: "Edit profile information."
  },
  postSubmit: {
    title: "Submit Petition",
    description: "Submit a petition to PawPrints."
  },
  postsInProgress: {
    title: "In Progress Petitions",
    description: "View petitions being actively worked on by Student Government."
  },
  postsList: {
    title: "Petitions",
    description: "PawPrints is a place for sparking change at RIT. Share ideas with the RIT community and influence decision making."
  },
  postsResponses: {
    title: "Responsed Petitions",
    description: "View petitions that have received responses from RIT Student Government and Administration."
  },
  postsTagList: {
    title: "Tagged Petitions",
    description: "View tagged petitions on PawPrints."
  },
  postPage: {
    title: "View Petition",
    description: "View petition on PawPrints."
  },
  postEdit: {
    title: "Edit Petition",
    description: "Edit petition."
  },
  about: {
    title: "About PawPrints",
    description: "Learn more about the history of PawPrints, its goal and vision."
  },
  api: {
    title: "API Access",
    description: "Student Government provides a read-only JSON REST API for retreiving petition information."
  },
  moderation: {
    title: "Moderation Policy",
    description: "PawPrints follows the RIT Code of Conduct for Computer and Network Use."
  },
  petitionProcess: {
    title: "Petition Process",
    description: "Learn how to effectively create a successful petition."
  },
  index: {
    title: "PawPrints",
    description: "PawPrints is a place for sparking change at RIT. Share ideas with the RIT community and influence decision making."
  },
  pageNotFound: {
    title: "Page Not Found",
    description: "The page you requested is not found."
  }
};

Router.configure({
  onBeforeAction: function () {
    var routeName = Router.current().route.getName();
    if (routeName)
      setSEO(seoData[routeName]);
    this.next();
  }
});

setSEO = function (data) {
  if (Meteor.isClient) {
    var image_url;
    if( Meteor.settings && Meteor.settings.public !== undefined &&
        Meteor.settings.public.root_url !== undefined) {
      image_url = Meteor.settings.public.root_url + '/logo_200x200.png';
    }
    SEO.set({
      title: data.title,
      meta: {
        'description': data.description
      },
      og: {
        'title': data.title,
        'description': data.description,
        'image': image_url
      }
    });
  }
};