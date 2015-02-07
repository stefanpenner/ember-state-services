import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.modelFor('application').findBy('id', parseInt(params.email_id, 10));
  },

  actions: {
    emailDidSave: function(model) {
      this.transitionTo('email.index', model);
    },

    emailEditWasCancelled: function(model) {
      this.transitionTo('email.index', model);
    }
  }
});
