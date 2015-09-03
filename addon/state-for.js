import Ember from 'ember';

var {
  computed,
  assert
} = Ember;

var stateHashMap = {};

/*
*
*/
function stateFactoryLookup(container, stateName) {
  let stateContainerName = `state:${stateName}`;
  let StateFactory = container.lookupFactory(stateContainerName);

  if (StateFactory === undefined) {
    throw new TypeError('Unknown StateFactory: `' + stateContainerName + '`');
  }

  return StateFactory;
}

/*
*
*/
function stateFromCache(stateName, keyValue) {
  let stateCache = stateHashMap[stateName];

  if (stateCache && stateCache[keyValue]) {
    return stateCache[keyValue];
  }
}

/*
*
*/
function addStateToCache(stateName, keyValue, state) {

  if (stateHashMap[stateName] && stateHashMap[stateName][keyValue]) {
    throw new Error(`${keyValue} is no unqiue and has collided with another state.`);
  }

  if (stateHashMap[stateName]) {
    stateHashMap[stateName][keyValue] = state;
    return state;
  }

  stateHashMap[stateName] = {
    [keyValue]: state
  };

  return state;
}


export default function(stateName, options) {
  assert('key property must be passed in via the second parameter', options.key);

  return computed(options.key, function() {
    debugger;

    let stateCache = stateFromCache(stateName, this.get(options.key));

    if (stateCache) {
      return stateCache;
    }

    let stateFactory = stateFactoryLookup(this.container, stateName);
    let state = stateFactory.create();

    addStateToCache(stateName, this.get(options.key), state);

    return state;
  });

}
