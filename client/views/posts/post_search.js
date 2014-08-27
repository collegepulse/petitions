Template.postSearch.events({
  'keyup .carousel-search-input': function (e) {
    var query = $(e.target).val();
    if (query.length) {
      Session.set("waiting", true);
      EasySearch.search('posts', query, function (err, data) {
        Session.set("waiting", false);
        Session.set("results", data.results);
      });
    }
  },
  'click a': function (e) {
    $('#modal-search').modal("hide");
  }
});