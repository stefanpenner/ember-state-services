import Route from '@ember/routing/route';
import todos from '../models/todos';

export default Route.extend({
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
