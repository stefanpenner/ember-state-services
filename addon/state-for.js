import EmberObject, { computed } from '@ember/object';
import { assert } from '@ember/debug';
import { getOwner } from '@ember/application';
import Ember from 'ember';

let {
  WeakMap
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
  let state = weakMaps[stateName];

  if (state === undefined) {
    state = weakMaps[stateName] = new WeakMap();
  }

  if (arguments.length === 1) {
    return state;
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

    if (!state.has(propertyValue)) {
      let newState = createStateFor(this, stateName, getOwner(this));
      state.set(propertyValue, newState);
    }

    return state.get(propertyValue);
  });
}

/*
 * Looks up the state factory on the owner and sets initial state
 * on the instance if desired.
 */
function createStateFor(context, stateName, owner) {
  let defaultState = {};
  const StateFactory = owner.factoryFor(`state:${stateName}`);

  if (!StateFactory) {
    return EmberObject.create();
  }

  const StateFactoryClass = StateFactory.class;

  if (typeof StateFactoryClass.initialState === 'function') {
    defaultState = StateFactoryClass.initialState.call(StateFactoryClass, context);
  }
  else if (StateFactoryClass.initialState) {
    throw new TypeError('initialState property must be a function');
  }

  if (EmberObject.detect(StateFactoryClass)) {
    return StateFactoryClass.create(defaultState);
  }

  return EmberObject.create(StateFactoryClass);
}
