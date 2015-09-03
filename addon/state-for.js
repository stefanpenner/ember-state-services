import Ember from 'ember';

var {
  computed,
  assert,
  typeOf
} = Ember;

var states = {};

/*
* Create the states object for a given stateName.
*
* @param container {object} container to lookup the state factory on
* @param stateName {string} state name which is also the name of the factory
*/
function createStates(container, stateName) {
  let stateContainerName = `state:${stateName}`;
  let StateFactory       = container.lookupFactory(stateContainerName);

  if (!StateFactory) {
    throw new TypeError(`Unknown StateFactory: \`${stateContainerName}\``);
  }

  states[stateName] = new Ember.MapWithDefault({
    defaultValue: () => buildDefaultState.call(this, StateFactory)
  });

  return states[stateName];
}

/*
* When creating the state instance we use `initialState` method
* on the state class to build its initial state. If it not
* specified then {} is used as the default state.
*
* @param Factory {StateFactoryClass} state factory from the container
* @return {stateInstance} state instance object from the factory
*/
function buildDefaultState(Factory) {
  let defaultState = {};

  if (typeOf(Factory.initialState) === 'function') {
    defaultState = Factory.initialState.call(this);
  }

  return Factory.create(defaultState);
}

/*
* Returns a computed property that returns state based off of a dynamic key.
*
* @param stateName {string} name of the state factory which is located in /states/<stateName>.js
* @param options {object}
* @param {string} options.key - required - the dynamic state key
* @param {object} options.container - optional - container reference
* @return {computed property}
*/
export default function stateFor(stateName, options) {
  var { key, container } = options;

  assert(`
    Missing \`key\` property within the second argument. You passed: ${JSON.stringify(options)}
    `, key);

  return computed(key, function() {
    assert(`
      Could not find the container on \`this\` or passed in via:
      stateFor('${stateName}', { key: ${key}, container: <pass container here> })
      `, this.container || container);

    if (states[stateName]) {
      return states[stateName].get(this.get(key));
    }

    return createStates
              .apply(this, [container || this.container, stateName])
              .get(this.get(key));
  });
}
