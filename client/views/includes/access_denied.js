Template.accessDenied.rendered = function () {
  Session.set("loginMsg", "Login to create a petition.");
  $('#loginModal').modal('show');
};