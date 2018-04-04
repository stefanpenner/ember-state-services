import { A } from '@ember/array';
import { equal } from '@ember/object/computed';
import Component from '@ember/component';
import stateFor from 'ember-state-services/state-for';

export default Component.extend({
  data: stateFor('todos', 'todo'),

  activeTodo: equal('todo.status', 'active'),

  actions: {
    edit() {
      this.set('data.isEditing', true);
    },

    update() {
      this.get('data').applyChanges(A(['title', 'body']));
      this.get('data').discardChanges();
    },

    cancel() {
      this.get('data').discardChanges();
    },

    trash() {
      this.set('todo.status', 'trash');
      this.get('data').discardChanges();
      this.transitionAction('active');
    },

    restore() {
      this.set('todo.status', 'active');
      this.transitionAction('trash');
    }
  }
});
