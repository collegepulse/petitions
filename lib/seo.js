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
    description: "Submit a petition."
  },
  postsInProgress: {
    title: "In Progress Petitions",
    description: "View petitions being actively worked on."
  },
  postsList: {
    title: "Petitions",
    description: "Spark change by creating petitions. Share ideas with the community and influence decision making."
  },
  postsResponses: {
    title: "Responsed Petitions",
    description: "View petitions that have received official responses."
  },
  postsTagList: {
    title: "Tagged Petitions",
    description: "View tagged petitions."
  },
  postPage: {
    title: "View Petition",
    description: "View petition."
  },
  postEdit: {
    title: "Edit Petition",
    description: "Edit petition."
  },
  about: {
    title: "About",
    description: "Learn more about the petition platform."
  },
  api: {
    title: "API Access",
    description: "Use the read-only JSON REST API for retreiving petition information."
  },
  moderation: {
    title: "Moderation Policy",
    description: "Review the moderation policy for petitions."
  },
  petitionProcess: {
    title: "Petition Process",
    description: "Learn how to effectively create a successful petition."
  },
  index: {
    title: "Petitions",
    description: "Spark change by creating petitions. Share ideas with the community and influence decision making."
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
    SEO.set({
      title: data.title,
      meta: {
        'description': data.description
      },
      og: {
        'title': data.title,
        'description': data.description,
        'image': window.location.origin + '/brand.png'
      }
    });
  }
};