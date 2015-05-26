Template.header.events({
  'click .navbar-search': function () {
    $('#modal-search').modal();
    setTimeout( function() {
      $('#search').focus();
    }, 500);
  }
});