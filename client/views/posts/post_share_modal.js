Template.postShareModal.helpers({
  signaturesRemaining: function () {
    return this.post.minimumVotes - this.post.votes;
  },
  percentRemaining: function () {
    var percent = parseInt((this.post.minimumVotes - this.post.votes) / this.post.minimumVotes * 100);
    return percent < 40 ? " (" + percent + "%)" : "";
  }
});