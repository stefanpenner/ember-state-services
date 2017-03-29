import Ember from 'ember';
import { module, test } from 'ember-qunit';
import stateFor from 'ember-state-services/state-for';

let registry;
let container;
let owner;
let subject;

let mockModelA    = { id: 1, subject: 'Hello World' };
let mockModelB    = { id: 2, subject: 'Foo Bar' };
let mockStatePOJO = { sample: 'example' };

const registryOpts = { singleton: true, instantiate: false };

const Owner = (function() {
  if (Ember._RegistryProxyMixin && Ember._ContainerProxyMixin) {
    return Ember.Object.extend(Ember._RegistryProxyMixin, Ember._ContainerProxyMixin);
  }

  return Ember.Object.extend();
})();

function createDummyObject (extendProps, createProps) {
  if (typeof owner.ownerInjection === "function") {
    return Ember.Object.extend(extendProps).create(owner.ownerInjection(), createProps);
  } else {
    return Ember.Object.extend(Ember.merge({container}, extendProps)).create(createProps);
  }
}

module('State Mixin', {
  unit: true,
  beforeEach() {
    registry  = new Ember.Registry();
    owner = Owner.create({
      __registry__: registry,
      __container__: null
    });
    container = new Ember.Container(registry, { owner });
    owner.__container__ = container;

    let mockState = Ember.Object.extend({
      foo: 'bar'
    });

    let mockStateB = Ember.Object.extend();

    mockState.reopenClass({
      initialState() {
        return { bar: 'foo' };
      }
    });

    mockStateB.reopenClass({
      initialState() {
        return { testing: 'Hello World' };
      }
    });

    registry.register('state:test-state', mockState, registryOpts);
    registry.register('state:test-state-b', mockStateB, registryOpts);
    registry.register('state:test-state-pojo', mockStatePOJO, registryOpts);
    subject = createDummyObject({
      model: mockModelA,
      data: stateFor('test-state', 'model')
    });
  }
});

test('that the state factory creates the correct object', function(assert) {
  assert.expect(1);
  assert.equal(subject.get('data.foo'), 'bar');
});

test('that initial state is called', function(assert) {
  assert.expect(1);
  assert.equal(subject.get('data.bar'), 'foo');
});

test('that when the stateFor key changes the state changes', function(assert) {
  assert.expect(3);

  subject.set('data.testing', 'state 1');
  subject.set('model', mockModelB);
  assert.equal(subject.get('data.testing'), undefined);
  subject.set('data.testing', 'state 2');

  subject.set('model', mockModelA);
  assert.equal(subject.get('data.testing'), 'state 1');

  subject.set('model', mockModelB);
  assert.equal(subject.get('data.testing'), 'state 2');
});

test('that a single object can have multiple state cps', function(assert) {
  let mockObject = createDummyObject({
    model: mockModelA,
    dataA: stateFor('test-state', 'model'),
    dataB: stateFor('test-state-b', 'model')
  });

  assert.expect(2);
  assert.equal(mockObject.get('dataA.bar'), 'foo');
  assert.equal(mockObject.get('dataB.testing'), 'Hello World');
});

test('that state can be a simple POJO', function(assert) {
  let mockObject = createDummyObject({
    model: mockModelA,
    data: stateFor('test-state-pojo', 'model')
  });

  assert.expect(3);
  assert.equal(mockObject.get('data.sample'), 'example');
  mockObject.set('data.sample', 'foo-bar');
  mockObject.set('model', mockModelB);
  assert.equal(mockObject.get('data.sample'), 'example');
  mockObject.set('model', mockModelA);
  assert.equal(mockObject.get('data.sample'), 'foo-bar');
});

test('that initialState gets passed with the correct parameters', function(assert) {
  const done = assert.async();
  const mockStateFoo = Ember.Object.extend();
  let mockObject;

  mockStateFoo.reopenClass({
    initialState(instance) {
      assert.equal(instance, mockObject);
      assert.equal(this.constructor, mockStateFoo.constructor);
      done();
      return {};
    }
  });

  registry.register('state:foo-test-state', mockStateFoo, registryOpts);

  mockObject = createDummyObject({
    data: stateFor('foo-test-state', 'model')
  }, {
    model: mockModelA
  });

  assert.expect(2);
  mockObject.get('data');
});

test('that if the state name does not exist one will be proved for you', function(assert) {
  let mockObject = createDummyObject({
    data: stateFor('a-state-that-does-not-exist', 'model')
  }, {
    model: mockModelA
  });

  assert.expect(1);
  assert.equal(mockObject.get('data').constructor, Ember.Object);
});
