import Ember from 'ember';
import todos from '../../models/todos';

export default Ember.Route.extend({
  model(params) {
    var todo = todos.filter(todo => todo.id === parseInt(params['todo-id']));

    return todo[0] || {};
  }
});
