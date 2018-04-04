import { helper as buildHelper } from '@ember/component/helper';

export default buildHelper(function(params) {
  var sliceAmount = params[1] || 80;

  if(params[0].length <= sliceAmount) {
    return params[0];
  }

  return `${params[0].slice(0, sliceAmount)}...`;
});
