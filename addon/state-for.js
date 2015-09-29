import Ember from 'ember';
import WeakMap from 'ember-weakmap/weak-map';

var {
  computed,
  assert,
  guidFor,
  typeOf
} = Ember;

/*
* Each key in this POJO is a name of a state with its value being a WeakMap.
*
* {
*    'my-state-name': WeakMapFoo,
*    'my-other-name': WeakMapBar
* }
*/
var weakMaps = {};

/*
* StateFor will return a computed property that will contain the state 'bucket'
* which is assoicated with the 'dependent-key-path' property. An optional third
* argument can be passed to give a more granular division of state.
*
* stateFor('state-name', 'dependent-key-path');
* stateFor('state-name', 'dependent-key-path',  {
*    secondaryKeys: ['foo', 'bar']
* });
*/
export default function stateFor(stateName, dependentKeyPath, secondaryProps = {}) {
  if (!dependentKeyPath) {
    return weakMaps[stateName];
  }

  assert('The property name must be a string', typeof dependentKeyPath === 'string');
  assert('The secondary properties must be an object', !secondaryProps || typeof secondaryProps === 'object');

  return computed(dependentKeyPath, function() {
    let propertyValue     = this.get(dependentKeyPath);
    let { secondaryKeys } = secondaryProps;

    if (typeof propertyValue !== 'object' && typeof propertyValue !== 'function') {
      throw new TypeError(
        `The property value for ${dependentKeyPath} resolved to ${propertyValue}.
        ${dependentKeyPath} must resolve to an object, array, or function`
      );
    }
    else if (!propertyValue || typeof propertyValue === 'undefined') {
      return propertyValue;
    }

    if (!weakMaps[stateName]) {
      weakMaps[stateName] = new WeakMap();
    }

    let state = weakMaps[stateName];

    if (!state.has(propertyValue)) {
      let secondaryMap = Ember.Map.create();

      secondaryMap.set(guidString(secondaryKeys), createStateFor(this, stateName));
      state.set(propertyValue, secondaryMap);
    }

    return state.get(propertyValue).get(guidString(secondaryKeys));
  });
}

/*
 * Looks up the state factory on the container and sets initial state
 * on the instance if desired.
 */
function createStateFor(context, stateName) {
  let defaultState  = {};
  let containerName = `state:${stateName}`;
  let StateFactory  = context.container.lookupFactory(containerName);

  if (!StateFactory) {
    return Object.create(null); // default to a blank object if no factory was found.
  }

  if (typeOf(StateFactory.initialState) === 'function') {
    defaultState = StateFactory.initialState.call(context);
  }

  if (StateFactory.create) {
    return StateFactory.create(defaultState);
  }

  return Object.create(StateFactory);
}

/*
* Creates a GUID for each member of a list and then
* concats the string.
*/
function guidString(listOfNonGuids) {
  if (!Array.isArray(listOfNonGuids)) {
    return '';
  }

  return listOfNonGuids
          .map(item => guidFor(item))
          .reduce((previousValue, item) => `${previousValue}${item}`);
}
