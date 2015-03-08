import Ember from 'ember';
import { module, test } from 'qunit';
import StateMixin from 'ember-state-services/mixin';
import BufferedProxy from 'ember-buffered-proxy/proxy';

var state;
var service;
var container;
var testObject;

module('StateMixin', {
  setup: function() {
    container = new Ember.Container();
    state = BufferedProxy.extend();

    container.register('state:test-state', state, {
        singleton:   true,
        instantiate: false
    });

    service = Ember.Service.extend(StateMixin, {
      stateName: 'test-state',
      container: container
    });

    testObject = Ember.Object.extend({
      service: service.create(),

      state: Ember.computed('stateKey', function() {
        return this.service.stateFor(this.get('stateKey'));
      })
    }).create();
  }
});

test('switching stateFor key will give new states for each unique key', function(assert) {
  assert.expect(2);

  testObject.set('stateKey', 'person1');
  testObject.set('state.firstName', 'John');

  testObject.set('stateKey', 'person2');
  testObject.set('state.firstName', 'Jane');

  testObject.set('stateKey', 'person1');
  assert.equal(testObject.get('state.firstName'), 'John');

  testObject.set('stateKey', 'person2');
  assert.equal(testObject.get('state.firstName'), 'Jane');
});


test('hasStateFor returns true/false if a state exists for a given key', function(assert) {
  assert.expect(2);

  testObject.set('stateKey', 'person1');
  testObject.set('stateKey', 'person2');

  assert.ok(testObject.service.hasStateFor('person1'));
  assert.ok(testObject.service.hasStateFor('person2'));
});

test('teardownStateFor properly clears a state for a key', function(assert) {
  assert.expect(5);

  testObject.set('stateKey', 'person1');
  testObject.set('state.firstName', 'John');

  testObject.set('stateKey', 'person2');
  testObject.set('state.firstName', 'Jane');

  testObject.set('stateKey', 'person1');
  Ember.run(function() {
    testObject.service.teardownStateFor('person1');
  });

  assert.equal(testObject.get('state.firstName'), undefined);
  assert.ok(!testObject.service.hasStateFor('person1'));
  testObject.set('stateKey', 'person2');
  assert.equal(testObject.get('state.firstName'), 'Jane');

  Ember.run(function() {
    testObject.service.teardownStateFor('person2');
  });
  assert.equal(testObject.get('state.firstName'), undefined);
  assert.ok(!testObject.service.hasStateFor('person2'));
});
