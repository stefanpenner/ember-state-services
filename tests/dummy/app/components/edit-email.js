import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'form',
  editEmailService: Ember.inject.service('edit-email'),
  state: Ember.computed('email', function() {
    return this.editEmailService.stateFor(this.get('email'));
  }).readOnly(),

  actions: {
    save: function() {
      this.get('state').applyChanges();
      this.sendAction('on-save', this.get('email'));
    },

    cancel: function() {
      this.get('state').discardChanges();
      this.sendAction('on-cancel', this.get('email'));
    }
  }
});
