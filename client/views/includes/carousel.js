Template.carousel.events = {
  'click .carousel-search' : function () {
    $('#modal-search').modal();
    $('.carousel-search-input:last').focus();
  }
}