import Ember from 'ember';
import WeakMap from 'ember-weakmap/weak-map';

var {
  computed,
  assert,
  typeOf
} = Ember;

/*
 * Each key in this POJO is a name of a state with the value
 * for that key being a WeakMap.
 */
var stateHashMap = {};

/*
* Returns a computed property if called like: stateFor('state-name', 'property-name') or
* returns the WeakMap if called like stateFor('state-name'). The most common case will be 
* the former but the latter allows advanced options like:
*
* stateFor('state-name').delete(this.get('property-name');
* stateFor('state-name').has(this.get('some-other-prop');
* stateFor('state-name').set(this.get('property-name'), {}); // Overrides the state
* stateFor('state-name').get(this.get('property-name'));
*/
export default function stateFor(stateName, propertyName) {
  if (!propertyName) {
    return stateHashMap[stateName];
  }

  assert('The second argument must be a string', typeOf(propertyName) === 'string');

  return computed(propertyName, function() {
    let propertyValue = this.get(propertyName);

    if (!stateHashMap[stateName]) {
      stateHashMap[stateName] = new WeakMap();
    }

    let stateWeakMap = stateHashMap[stateName];

    if (!stateWeakMap.has(propertyValue)) {
      let newState = createStateFor(this, stateName, this.container);
      stateWeakMap.set(propertyValue, newState);
    }

    return stateWeakMap.get(propertyValue);
  });
}

/*
 * Looks up the state factory on the container and sets initial state
 * on the instance if desired.
 */
function createStateFor(context, stateName, container) {
  let defaultState  = {};
  let containerName = `state:${stateName}`;
  let StateFactory  = container.lookupFactory(containerName);

  if (!StateFactory) {
    throw new TypeError(`Unknown StateFactory: ${containerName}`);
  }

  if (typeOf(StateFactory.initialState) === 'function') {
    defaultState = StateFactory.initialState.call(context);
  }

  if (StateFactory.create) {
    return StateFactory.create(defaultState);
  }

  return StateFactory;
}
