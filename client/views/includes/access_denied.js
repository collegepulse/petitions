Template.accessDenied.rendered = function () {
  Session.set("loginMsg", "You need to login to do that.");
  $('#loginModal').modal('show');
};