import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'form',
  editEmailService: Ember.inject.service('edit-email'),
  data: Ember.computed('email', function() {
    return this.get('editEmailService').stateFor(this.get('email'));
  }).readOnly(),

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
