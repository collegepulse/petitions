Template.moderationButton.events({
  'submit #changeModeration': function(e){
    e.preventDefault();
    Meteor.call('toggleModeration');
  }
});

Template.moderationButton.helpers({
  'moderationStyle' : function(){
    if(Singleton.findOne().moderation){
      return 'Enabled'
    }else{
      return 'Disabled'
    }
  }
});
