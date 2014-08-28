Template.carousel.events = {
  'click .carousel-search' : function () {
    $('#modal-search').modal();
    setTimeout( function() {
      $('#search').focus();
    }, 500);
  }
}