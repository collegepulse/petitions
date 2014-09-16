Template.petitionGroup.events({
  'change #petition-order': function(evt) {
     Session.set("postOrder", evt.currentTarget.value);
  },
  'click #load-more': function () {
    Session.set('postsLimit', Session.get('postsLimit') + 12);
  }
});