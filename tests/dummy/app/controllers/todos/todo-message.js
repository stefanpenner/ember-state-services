import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    transition(todoState) {
      this.send('transitionAndRefresh', todoState);
    }
  }
});
