import Ember from 'ember';
import Session from 'service-sessions/mixin';

export default Ember.Object.extend(Session, {
  sessionName: 'edit-email',
  setupSession: function(factory, model) {
    return factory.create({
      content: model
    });
  }
});
