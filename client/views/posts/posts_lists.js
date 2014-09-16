Template.petitionGroup.events({
  'change #petition-order': function(evt) {
     Session.set("postOrder", evt.currentTarget.value);
  }
});