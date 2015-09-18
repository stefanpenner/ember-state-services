import Ember from 'ember';
import { module, test } from 'qunit';
import stateFor from 'ember-state-services/state-for';

let registry;
let container;
let subject;

let mockModelA    = { id: 1, subject: 'Hello World' };
let mockModelB    = { id: 2, subject: 'Foo Bar' };
let mockStatePOJO = { sample: 'example' };

const registryOpts = { singleton: true, instantiate: false };

module('State Mixin', {
  setup() {
    registry  = new Ember.Registry();
    container = new Ember.Container(registry);

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

    subject = Ember.Object.extend({
      container,
      model: mockModelA,
      data: stateFor('test-state', 'model')
    }).create();
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
  let mockObject = Ember.Object.extend({
    container,
    model: mockModelA,
    dataA: stateFor('test-state', 'model'),
    dataB: stateFor('test-state-b', 'model')
  }).create();

  assert.expect(2);
  assert.equal(mockObject.get('dataA.bar'), 'foo');
  assert.equal(mockObject.get('dataB.testing'), 'Hello World');
});

test('that state can be a simple POJO', function(assert) {
  let mockObject = Ember.Object.extend({
    container,
    model: mockModelA,
    data: stateFor('test-state-pojo', 'model')
  }).create();

  assert.expect(3);
  assert.equal(mockObject.get('data.sample'), 'example');
  mockObject.set('data.sample', 'foo-bar');
  mockObject.set('model', mockModelB);
  assert.equal(mockObject.get('data.sample'), 'example');
  mockObject.set('model', mockModelA);
  assert.equal(mockObject.get('data.sample'), 'foo-bar');
});
