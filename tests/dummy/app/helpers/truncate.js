import Ember from "ember";

export default Ember.Helper.helper(function(params) {
  var sliceAmount = params[1] || 80;

  if(params[0].length <= sliceAmount) {
    return params[0];
  }

  return `${params[0].slice(0, sliceAmount)}...`;
});
