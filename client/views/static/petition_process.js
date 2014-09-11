Template.petitionProcess.helpers({
  threshold_last_updated: function thresholdLastUpdatedAt () {
    return new moment(this.singleton.threshold_updated_at).format("L");
  }
});