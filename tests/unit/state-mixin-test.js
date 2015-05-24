import Ember from 'ember';
import { module, test } from 'qunit';
import StateMixin from 'ember-state-services/mixin';

let State;
let Service;
let registry;
let container;
let subject;

module('State Mixin', {
  setup: function() {
    registry = new Ember.Registry();
    container = new Ember.Container(registry);

    registry.register('state:test-state', Ember.Object.extend({}), {
        singleton:   true,
        instantiate: false
    });

    Service = Ember.Service.extend(StateMixin, {
      stateName: 'test-state',
      container: container
    });

    subject = Ember.Object.extend({
      service: Service.create({
        container: container
      }),
      model: null,

      state: Ember.computed('model', function() {
        return this.service.stateFor(this.get('model'));
      })
    }).create();
  }
});

test('state object is created with reference to correct container', function(assert) {
  assert.expect(1);

  assert.equal(subject.get('state.container'), container);
});

test('switching stateFor key will give new states for each unique key', function(assert) {
  assert.expect(2);

  subject.set('model', 'person1');
  subject.set('state.firstName', 'John');

  subject.set('model', 'person2');
  subject.set('state.firstName', 'Jane');

  subject.set('model', 'person1');
  assert.equal(subject.get('state.firstName'), 'John');

  subject.set('model', 'person2');
  assert.equal(subject.get('state.firstName'), 'Jane');
});

test('hasStateFor returns true/false if a state exists for a given key', function(assert) {
  assert.expect(6);

  assert.ok(!subject.service.hasStateFor('person1'));
  assert.ok(!subject.service.hasStateFor('person2'));

  subject.set('model', 'person1');
  subject.get('state');

  assert.ok(subject.service.hasStateFor('person1'));
  assert.ok(!subject.service.hasStateFor('person2'));

  subject.set('model', 'person2');
  subject.get('state');

  assert.ok(subject.service.hasStateFor('person1'));
  assert.ok(subject.service.hasStateFor('person2'));
});

test('teardownStateFor properly clears a state for a key', function(assert) {
  assert.expect(5);

  subject.set('model', 'person1');
  subject.set('state.firstName', 'John');

  subject.set('model', 'person2');
  subject.set('state.firstName', 'Jane');

  subject.set('model', 'person1');
  subject.get('state');

  // teardownState calls destroy which is scheduled
  Ember.run(function() {
    subject.service.teardownStateFor('person1');
  });

  assert.equal(subject.get('state.firstName'), undefined);
  assert.ok(!subject.service.hasStateFor('person1'));
  subject.set('model', 'person2');
  assert.equal(subject.get('state.firstName'), 'Jane');

  Ember.run(function() {
    subject.service.teardownStateFor('person2');
  });

  assert.equal(subject.get('state.firstName'), undefined);
  assert.ok(!subject.service.hasStateFor('person2'));
});

test('Creating a state service with an unknown StateFactory throws error', function(assert) {
  assert.expect(1);

  Service = Ember.Service.extend(StateMixin, {
    stateName: 'test-state-that-does-not-exist',
    container: container
  });

  assert.throws(function() {
    Service.create();
  }, TypeError, 'Unknown StateFactory: `test-state-that-does-not-exist`');
});

test('key is stored in content in state', function(assert) {
  assert.expect(1);

  subject.set('model', 'person');

  assert.equal(subject.get('state.content'), 'person');
});

test('content property name can be configured in service', function(assert) {
  assert.expect(1);

  Ember.run(function() {
    subject.service.set('keyPropertyName', 'key');
  });

  subject.set('model', 'person');

  assert.equal(subject.get('state.key'), 'person');
});
