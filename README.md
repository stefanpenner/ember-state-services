# Ember State Services

[![Build Status](https://travis-ci.org/stefanpenner/ember-state-services.svg?branch=master)](https://travis-ci.org/stefanpenner/ember-state-services)
[![Code Climate](https://codeclimate.com/github/stefanpenner/ember-state-services/badges/gpa.svg)](https://codeclimate.com/github/stefanpenner/ember-state-services)
[![Ember Observer Score](http://emberobserver.com/badges/ember-state-services.svg)](http://emberobserver.com/addons/ember-state-services)
[![npm version](https://badge.fury.io/js/ember-state-services.svg)](http://badge.fury.io/js/ember-state-services)

This addon introduces a state management pattern for your ambious applications.

State management is one of the most complex apsects of large application design and when done wrong often leads to bugs and errors. EmberJS contains 2 high-level avenues for storing state: controllers (long-term state) and components (short-term state). Controllers are singletons and any state you set on them will stay there until your application is reloaded or you override the previous value. Components on the other hand are created and destroyed as they enter/leave the DOM and any state that is set on them will be removed/reset each time they are recreated. As you build more complex applications you will find yourself needing a way to have some sort of middle ground solution. Something that has properties of both long-term state and short-term state. This is what ember-state-services sets out to provide.

An example could be a master/detail experience where the detail view is a component which allows editing of content. It would be unfortunate if navigating would lose un-saved changes (short-term state); it would also be unfortunate if the state between the edit components were to leak between each other (long-term state). Instead, the addon issues a unique state per reference key, which keeps management safe and easy.

## Installation

```shell
ember install ember-state-services
```

## Setup

### State file

```js
/*
 * First create a state file that returns an object within app/states/<STATE_NAME>.js
 */
import Ember from 'ember';

export default Ember.Object.extend();
```

## Usage

### Component

```js
import Ember from 'ember';
import stateFor from 'emebr-state-services/state-for';

export default Ember.Component.extend({
  tagName: 'form',

  /*
  * stateFor returns a computed property that returns a given
  * state object based on the 'email' property. Whenever email
  * changes a new state object will be returned. This allows us to create
  * components that maintain a consistent state even after being destroyed but
  * does not share that state across keys.
  */
  data: stateFor('<STATE_NAME>', 'email'),

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

```
git clone git@github.com:stefanpenner/ember-state-services.git
cd ember-state-services
npm i; bower i
ember server
```

Then visit the demo app: http://localhost:4200 in your browser
