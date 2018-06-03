module.exports = {
  normalizeEntityName: function() {}, // no-op since we're just adding dependencies

  afterInstall: function() {
    return this.addAddonToProject('ember-buffered-proxy', '^1.0.0');
  }
};
