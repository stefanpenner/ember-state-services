import Ember from 'ember';
import todos from '../models/todos';

export default Ember.Route.extend({
  model(params) {
    return todos.filter(todo => todo.status === params.status);
  },

  actions: {
    transitionAndRefresh(todoState) {
      this.transitionTo('todos', todoState);
      this.refresh();
    }
  }
});
