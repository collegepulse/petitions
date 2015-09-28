Template.petitionGroup.events({
  'change #petition-order': function(evt) {
     Session.set("postOrder", evt.currentTarget.value);
  },
  'click #load-more': function () {
    Session.set('postsLimit', Session.get('postsLimit') + 12);
  },
  'click .tag-item': function (e) {
    if(e.target.id == 'all'){
      Session.set('activeTag', null);
    }else{
      Session.set('activeTag', e.target.id);
    }
  }
});

Template.petitionGroup.helpers({
  'isActiveTag' : function(name){
    if((name == Session.get('activeTag')) ||
    (!Session.get('activeTag') && (name == 'all'))){
      return 'active';
    }else{
      return '';
    }

  }
});

Template.petitionGroup.rendered = function () {
  $('[data-toggle="tooltip"]').tooltip();
};
