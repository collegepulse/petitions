Template.moderatePage.events({
  'submit #changeModeration': function(e){
    e.preventDefault();
    Meteor.call('toggleModeration');
  }

});
