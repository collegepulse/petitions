Template.login.rendered = function () {
  $('#loginModal').on('hidden.bs.modal', function onLoginModalClose () {
    Session.set("loginMsg", null);
  });
};