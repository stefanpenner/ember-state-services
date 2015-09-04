import Ember from 'ember';
import stateFor from 'ember-state-services/state-for';

export default Ember.Component.extend({

  data: stateFor('todos', { key: 'todo.id' }),

  actions: {
    edit() {
      this.set('data.isEditing', true);
    },

    update() {
      this.get('data').applyChanges(Ember.A(['title', 'body']));
      this.get('data').discardChanges();
    },

    cancel() {
      this.get('data').discardChanges();
    },

    markAs(status) {
      switch(status) {
        case 'active':
          this.set('todo.status', 'completed');
          break;
        case 'completed':
        case 'trash':
          this.set('todo.status', 'active');
          break;
      }

      this.get('data').discardChanges();
    }
  }
});
