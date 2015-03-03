import Ember from 'ember';
import StateMixin from 'ember-state-services/mixin';

export default Ember.Object.extend(StateMixin, {
  stateName: 'edit-email',
  setupState: function(factory, model) {
    return factory.create({
      content: model
    });
  }
});
