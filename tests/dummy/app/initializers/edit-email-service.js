export default {
  name: 'ember-edit-service',
  initialize: function(container, app) {
    app.inject('component:edit-email', 'editEmailService', 'service:edit-email');
  }
};
