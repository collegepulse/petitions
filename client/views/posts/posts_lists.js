Template.petitionGroup.events({
  'change #petition-order': function(evt) {
     Session.set("postOrder", evt.currentTarget.value);
  },
  'click #load-more': function () {
    Session.set('postsLimit', Session.get('postsLimit') + 12);
  }
});

Template.petitionGroup.helpers({
  'sortType': function(title){
    if(title == "Responses"){
      return "responded_at"
    }else{
      return "submitted"
    }
  }
});

Template.petitionGroup.rendered = function () {
  $('[data-toggle="tooltip"]').tooltip();
};
