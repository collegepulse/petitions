Emails = new Meteor.Collection('emails');

Meteor.methods({
  email: function (emailAttributes) {

    var email = _.extend(_.pick(emailAttributes, 'email'));

    if (email.email.length > 50)
      throw new Meteor.Error(422, "Email too long.");

    var emailId = Emails.insert(email);
    return emailId;
  }
});