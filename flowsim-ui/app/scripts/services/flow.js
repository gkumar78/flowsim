'use strict';

/**
 * @ngdoc service
 * @name flowsimUiApp.flow
 * @description
 * # flow
 * Service in the flowsimUiApp.
 */
angular.module('flowsimUiApp')
  .factory('Flow', function(Match, Instruction) {

function Flow(flow){
  if(flow instanceof Flow || (typeof flow === 'object' && flow !== null)){
    _.extend(this, flow);
    this.match = new Match.Match(flow.match);
    this.ins = new Instruction.Set(flow.ins);
  } else {
    this.match = new Match.Match();
    this.ins   = new Instruction.Set();
  }
}

Flow.prototype.clone = function() {
  return new Flow(this);
};

Flow.prototype.select = function(key) {
  if(this.match.match(key)) {
    return this.ins;
  } else {
    return null;
  }
};

return {
  Flow: Flow
};

});
