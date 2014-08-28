Template.postSearch.rendered = function () {
  $('#modal-search').on('hidden.bs.modal', function () {
    $('#search').val("");
    Session.set("results", null);
  });
};

Template.postSearch.events({
  'keyup #search': function (e) {
    var query = $(e.target).val();
    if (query.length) {
      setTimeout( function() {
        Session.set("waiting", true);
        EasySearch.search('posts', query, function (err, data) {
          Session.set("waiting", false);
          Session.set("results", data.results);
        });
      }, 100);
    }
  },
  'click a': function (e) {
    $('#modal-search').modal("hide");
  }
});

Template.postSearch.helpers({
  noResults: function() {
    return Session.get('results') && Session.get('results').length == 0;
  }
});