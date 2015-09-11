import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    transition(todoState) {
      this.send('transitionAndRefresh', todoState);
    }
  }
});
