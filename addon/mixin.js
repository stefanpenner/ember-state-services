import Ember from 'ember';

export default Ember.Mixin.create({
  init: function() {
    this._super.apply(this, arguments);

    var service = this;
    var container = this.container;
    var sessionName = 'session:' + this.sessionName;

    if (!container.has(sessionName)) {
      throw new TypeError('Unknown SessionFactory: `' + sessionName + '`');
    }

    var SessionFactory = this.container.lookupFactory(sessionName);

    this._sessions = new Ember.MapWithDefault({
      defaultValue: function(key) {
        return service.setupSession(SessionFactory, key);
      }
    });
  },

  setupSession: function(factory, key) {
    return factory.create({ model: key });
  },

  hasSessionFor: function(key) {
    return this._sessions.has(key);
  },

  sessionFor: function(key) {
    return this._sessions.get(key);
  },

  cleanupSession: function(session) {
    session.destroy();
  },

  endSessionFor: function(key) {
    var session = this._sessions.get(key);

    this.cleanupSession(session);
    this._sessions.delete(key);
  }
});
