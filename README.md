# Ember State Services [![Build Status](https://travis-ci.org/stefanpenner/ember-state-services.svg)](https://travis-ci.org/stefanpenner/ember-state-services)

This addon introduces a state management pattern using services, which allows them to serve
multiple consumers (often components).

An example could be a master/detail experience where the detail view is a
component which allows editing of content. It would be unfortunate if
navigating would lose un-saved changes; it would also be unfortunate if the
state between the edit components were to leak between each other. Instead, the service issues a unique state per reference key, which keeps management safe and easy.

## Installation

```shell
ember install ember-state-services
```

## Usage

### State file

```js
/*
 * First create a state file that returns an object within app/states/<STATE_NAME>.js
 */
import Ember from 'ember';

export default Ember.Object.extend();
```

### Component

```js
import Ember from 'ember';
import stateFor from 'emebr-state-services/state-for';

export default Ember.Component.extend({
  tagName: 'form',

  /*
  * stateFor returns a computed property that returns a given
  * state object based on the 'email.id' property. Whenever email.id
  * changes a new state object will be returned. This allows us to create
  * components that maintain a consistent state even after being destroyed but
  * does not share that state across keys.
  */
  data: stateFor('<STATE_NAME>', 'email.id'),

  actions: {
    submitForm() {
      var stateData = this.get('data');
      this.set('model', stateData);
    }
  }
});
```

### template

```js
<label>Subject: {{input value=data.subject}}</label><br>
<label>from:   {{input value=data.from}}</label><br>
<label>body:   {{textarea value=data.body}}</label><br>
<button {{action 'submitForm'}}>Submit Form</button>
```

## Advanced

### Setting initial state

```js
import Ember from 'ember';

var MyStateObject = Ember.Object.extend();

MyStateObject.reopenClass({
  initialState() {
    return {
      foo: 'bar',
      hello: 'world'
    };
  }
});

export default MyStateObject;
```

### Using ember-buffered-proxy

```js
import { BufferedProxy } from 'ember-buffered-proxy/proxy';

export default BufferedProxy.extend();
```

Learn more about buffered proxy: https://github.com/yapplabs/ember-buffered-proxy

## Example Demo

* `ember server`
* Then visit: http://localhost:4200 in your browser
