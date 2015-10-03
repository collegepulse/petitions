Template.postCard.events({
  'click .card-tag': function(e){
    Session.set('activeTag', e.target.name);
  }
});
