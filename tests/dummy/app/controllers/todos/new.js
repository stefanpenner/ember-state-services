import Controller from '@ember/controller';
import todos from '../../models/todos';

export default Controller.extend({
  actions: {
    createTodo() {
      todos.push({
        title: this.get('title'),
        body: this.get('body'),
        status: 'active',
        id: (todos.length + 1)
      });

      this.transitionToRoute('todos', 'active');
    }
  }
});
