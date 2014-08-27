Template.postReport.events({
  'submit form': function (e) {
    e.preventDefault();

    Session.set("waiting", true);

    var _id = this.post._id,
        reason = $("input[name='report-reason']:checked").val();

    Meteor.call('report', _id, reason, function(error) {

      Session.set("waiting", false);

      if (error) {
        throwError(error.reason);
      } else {
        throwError("Petition reported.");
        setTimeout( function() { $('#postReportModal').modal("hide") }, 1000); 
      }
    });
  }
});