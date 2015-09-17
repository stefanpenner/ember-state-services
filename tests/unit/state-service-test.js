import Ember from 'ember';
import { module, test } from 'qunit';
import stateFor from 'ember-state-services/state-for';

let registry;
let container;
let subject;

let mockModelA = { id: 1, subject: 'Hello World' };
let mockModelB = { id: 2, subject: 'Foo Bar' };

module('State Mixin', {
  setup() {
    registry  = new Ember.Registry();
    container = new Ember.Container(registry);

    let mockState = Ember.Object.extend({
      foo: 'bar'
    });

    mockState.reopenClass({
      initialState() {
        return { bar: 'foo' };
      }
    });

    registry.register('state:test-state', mockState, {
      singleton:   true,
      instantiate: false
    });

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
