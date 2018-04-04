import Route from '@ember/routing/route';
import todos from '../../models/todos';

export default Route.extend({
  model(params) {
    var todo = todos.filter(todo => todo.id === parseInt(params.todo_id));

    return todo[0] || {};
  }
});
