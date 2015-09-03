import Ember from 'ember';
import stateFor from 'ember-state-services/state-for';

export default Ember.Component.extend({
  tagName: 'form',
  data: stateFor('edit-email', { key: 'email.id' }),

  actions: {
    save: function() {
      this.get('data').applyChanges();
      this.sendAction('on-save', this.get('email'));
    },

    cancel: function() {
      this.get('data').discardChanges();
      this.sendAction('on-cancel', this.get('email'));
    }
  }
});
