import Ember from 'ember';

var {
  computed,
  assert
} = Ember;

var states = {};

function createState(container, stateName) {
  const stateContainerName = `state:${stateName}`;
  const StateFactory = container.lookupFactory(stateContainerName);

  if (StateFactory === undefined) {
    throw new TypeError('Unknown StateFactory: `' + stateContainerName + '`');
  }

  states[stateName] = new Ember.MapWithDefault({
    defaultValue: key => setupState(StateFactory, key)
  });

  return states;
}

function setupState(Factory, model) {
  return Factory.create({
    content: model
  });
}

export default function(stateName, options) {
  assert('key property must be passed in via the second parameter', options.key);

  return computed(options.key, function() {
    if (states[stateName]) {
      return states[stateName].get(this.get(options.key));
    }

    createState(this.container, stateName);
    return states[stateName].get(this.get(options.key));
  });
}
