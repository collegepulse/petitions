Template.header.events({
  'click .navbar-search': function () {
    $('#modal-search').modal();
    setTimeout( function() {
      $('#search').focus();
    }, 500);
  }
});

Template.header.helpers({
  'moderationEnabled' : function(){
    var enabled = Singleton.findOne().moderation;
    var admin = Roles.userIsInRole(Meteor.user(), ['admin']);
    var moderator = Roles.userIsInRole(Meteor.user(), ['moderator']);
    if(enabled &&(admin || moderator)){
      return true;
    }else{
      return admin;
    }
  }
})
