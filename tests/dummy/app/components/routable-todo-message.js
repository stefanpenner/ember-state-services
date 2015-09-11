import Ember from 'ember';
import stateFor from 'ember-state-services/state-for';

export default Ember.Component.extend({
  data: stateFor('todos', { key: 'todo.id' }),

  activeTodo: Ember.computed.equal('todo.status', 'active'),

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

    trash() {
      this.set('todo.status', 'trash');
      this.get('data').discardChanges();
      this.attrs.transitionAction('active');
    },

    restore() {
      this.set('todo.status', 'active');
      this.attrs.transitionAction('trash');
    }
  }
});
