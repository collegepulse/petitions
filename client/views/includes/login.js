Template.login.rendered = function () {
  $('#loginModal').on('shown.bs.modal', function() {
    $("#username").focus();
  });
  $('#loginModal').on('hidden.bs.modal', function onLoginModalClose () {
    Session.set("loginMsg", null);
  });
};