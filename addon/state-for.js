import Ember from 'ember';
import WeakMap from 'ember-weakmap/weak-map';
import getOwner from 'ember-getowner-polyfill';

let {
  computed,
  assert
} = Ember;

/*
 * Each key in this POJO is a name of a state with the value
 * for that key being a WeakMap.
 */
let weakMaps = {};

/*
* Returns a computed property if called like: stateFor('state-name', 'property-name') or
* returns the WeakMap if called like stateFor('state-name'). The most common case will be
* the former but the latter allows advanced options like:
*
* stateFor('state-name').delete(this.get('property-name'));
* stateFor('state-name').has(this.get('some-other-prop'));
* stateFor('state-name').set(this.get('property-name'), {}); // Overrides the state
* stateFor('state-name').get(this.get('property-name'));
*/
export default function stateFor(stateName, propertyName) {
  if (arguments.length === 1) {
    return weakMaps[stateName];
  }

  assert('The second argument must be a string', typeof propertyName === 'string');

  return computed(propertyName, function() {
    let propertyValue = this.get(propertyName);

    // if the propertyValue is null/undefined we simply return null/undefined
    if (!propertyValue || typeof propertyValue === 'undefined') {
      return propertyValue;
    }

    if (typeof propertyValue !== 'object' && typeof propertyValue !== 'function') {
      throw new TypeError('The state key must resolve to a non primitive value');
    }

    if (!weakMaps[stateName]) {
      weakMaps[stateName] = new WeakMap();
    }

    let state = weakMaps[stateName];

    if (!state.has(propertyValue)) {
      let newState = createStateFor(this, stateName, getOwner(this));
      state.set(propertyValue, newState);
    }

    return state.get(propertyValue);
  });
}

/**
 * Clears all states for the given state name.
 *
 * clearStatesFor('state-name');
 */
export function clearStatesFor(stateName) {
  if (stateName && weakMaps[stateName]) {
    weakMaps[stateName] = null;
  }
}

/*
 * Looks up the state factory on the owner and sets initial state
 * on the instance if desired.
 */
function createStateFor(context, stateName, owner) {
  let defaultState = {};
  let StateFactory = owner._lookupFactory(`state:${stateName}`);

  if (!StateFactory) {
    StateFactory = {};
  }

  if (typeof StateFactory.initialState === 'function') {
    defaultState = StateFactory.initialState.call(StateFactory, context);
  }
  else if (StateFactory.initialState) {
    throw new TypeError('initialState property must be a function');
  }

  if (StateFactory.create) {
    return StateFactory.create(defaultState);
  }

  return Ember.Object.create(StateFactory);
}
