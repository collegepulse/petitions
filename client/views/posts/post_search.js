Template.postSearch.rendered = function () {
  $('#modal-search').on('shown.bs.modal', function () {
    $('body').css('overflow', 'hidden');
    $('.modal-backdrop').css('opacity', '0.5');
  });
  $('#modal-search').on('hidden.bs.modal', function () {
    $('body').css('overflow', 'visible');
    $('.modal-backdrop').css('opacity', '0');
    $('#search').val("");
    Session.set("results", null);
  });
};

Template.postSearch.events({
  'keyup #search': function (e) {
    var query = $(e.target).val();
    if (query.length >= 3) {
      setTimeout( function() {
        Session.set("waiting", true);
        EasySearch.search('posts', query, function (err, data) {
          Session.set("waiting", false);
          Session.set("results", data.results);
        });
        GAnalytics.event("post", "search", query);
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

Template.postSearch.rendered = function () {
  $("#search").attr('autocomplete', 'off');
}