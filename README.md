# ember-state-services [![Build Status](https://travis-ci.org/stefanpenner/ember-state-services.svg)](https://travis-ci.org/stefanpenner/ember-state-services)

This addon introduces a state management pattern using services, which allows them to serve
multiple consumers (often components). 

An example could be a master/detail experience where the detail view is a
component which allows editing of content. It would be unfortunate if
navigating would lose un-saved changes; it would also be unfortunate if the
state between the edit components were to leak between each other. Instead, the service issues a unique state per reference key, which keeps management safe and easy.

### Collaborators:

* services: singletons which maintain and issue out states to consumers
* states: non-singletons, typically key'd to a model which provide ephemeral state.

## Usage

### service

```js
// app/services/email-edit.js
import Ember from 'ember';
import StateMixin from 'ember-state-services/mixin'

export default Ember.Object.extend(StateMixin, {
  stateName: 'emailEdit',
  setupState: function(Factory, model) {
    return Factory.create({
      content: model
    });
  }
});
```

### state

```js
// app/states/email-edit.js
import BufferedProxy from 'ember-buffered-proxy/proxy';

export default BufferedProxy.extend();
```

learn more about buffered proxy: https://github.com/yapplabs/ember-buffered-proxy

### component

```js
import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'form',
  editEmailService: Ember.inject.service('email-edit'),
  state: Ember.computed('email', function() {
    return this.editEmailService.stateFor(this.get('email'));
  }).readOnly(),

  actions: {
    save: function() {
      this.get('state').applyChanges();
      this.sendAction('on-save', this.get('email'));
    },

    cancel: function() {
      this.get('state').discardChanges();
      this.sendAction('on-cancel', this.get('email'));
    }
  }
});
```

### template

```js
<label>Subject: {{input value=state.subject}}</label><br>
<label>from:   {{input value=state.from}}</label><br>
<label>body:   {{textarea value=state.body}}</label><br>
```

## Installation

* `npm install --save ember-state-services`

## Example

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
