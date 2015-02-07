import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'form',
  session: Ember.computed('email', function() {
    return this.editEmailService.sessionFor(this.get('email'));
  }).readOnly(),

  actions: {
    save: function() {
      this.get('session').applyChanges();
      this.sendAction('on-save', this.get('email'));
    },

    cancel: function() {
      this.get('session').discardChanges();
      this.sendAction('on-cancel', this.get('email'));
    }
  }
});
