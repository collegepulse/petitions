Template.moderationButton.events({
  'submit #changeModeration': function(e){
    e.preventDefault();
    Meteor.call('toggleModeration');
  }
});

Template.moderationButton.helpers({
  'moderationStyle' : function(){
    console.log(Singleton.findOne().moderation);
    if(Singleton.findOne().moderation){
      return 'Enabled'
    }else{
      return 'Disabled'
    }
  }
});
