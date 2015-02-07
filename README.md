# Service-sessions

This addon introduces a session pattern, to allow stateful services to service
multiple consumers (often components). 

An example could be a master/detail experience where the detail view is a
component which allows editing of content. It would be unfortunate, if
navigating would lose un-saved changes, it would also be unfortunate if the
state between the edit components were to leak. Instead the service issuing our
sessions allows safe and easy session state managements

### Collaborators:

* services: singletons which maintain and issue out sessions to consumers
* sessions: non-singletons, typically key'd to a model which provide ephmeral state.

## Usage

### service

```js
// app/services/email-edit.js
import Session from 'service-sessions'
import Ember from 'ember';

export default Ember.Object.extend(Session, {
  sessionName: 'emailEdit',
  prepareSession: function(Factory, model) {
    return Factory.create({
      content: model
    });
  }
});
```

### session

```js
// app/sessions/email-edit.js
import BufferedProxy from 'ember-buffered-proxy/proxy';

export default BufferedProxy.extend();
```

learn more about buffered proxy: https://github.com/yapplabs/ember-buffered-proxy

### component
```js
import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'form',
  session: Ember.computed('email', function() {
    return this.editEmailService.sessionFor(this.get('email'));
  }).readOnly(),

  actions: {
    save: function() {
      this.get('session').applyChanges();
      this.sendAction('on-save', this.get('email'));
    },

    cancel: function() {
      this.get('session').discardChanges();
      this.sendAction('on-cancel', this.get('email'));
    }
  }
});
```

### template

```js
<label>Subect: {{input value=session.subject}}</label><br>
<label>from:   {{input value=session.from}}</label><br>
<label>body:   {{textarea value=session.body}}</label><br>
```

## Installation

* `npm install --save ember-service-sessions'

## Example

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
