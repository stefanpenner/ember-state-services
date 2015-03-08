import Ember from 'ember';
import StateMixin from 'ember-state-services/mixin';

export default Ember.Service.extend(StateMixin, {
  stateName: 'edit-email',
  setupState: function(factory, model) {
    return factory.create({
      content: model
    });
  }
});
