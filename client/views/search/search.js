Template.search1.events({
  'keyup #search': function (e) {
    var query = $(e.target).val();
    if (query.length >= 0) {
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
  },

});

Template.search1.helpers({
  noResults: function() {
    return Session.get('results') && Session.get('results').length == 0;
  }
});

Template.search1.rendered = function () {
  $("#search").attr('autocomplete', 'on');

  $('.dropdown-toggle').dropdown();
  $('#divNewNotifications li > a').click(function(){
    $('#title').text($(this).html());
  });
}
