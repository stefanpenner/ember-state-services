Upgrading Guide
===============

Upgrade from 2.x to 3.x
-----------------------
The breaking change from 2.x to 3.x is the context of the `initialState`. If you were accessing the `this`
context in 2.x, like this:

```javascript
MyStateObject.reopenClass({
  initialState() {
    return this.get('someProp');
  }
});
```

you will need to access it on the newly passed `instance` arguments, like this:

```javascript
const { get } = Ember;

MyStateObject.reopenClass({
  initialState(instance) {
    return get(instance, 'someProp');
  }
});
```

For more granular information, check out the
[diff](https://github.com/stefanpenner/ember-state-services/compare/v2.0.0...v3.0.0).

Upgrade from 1.x to 2.x
-----------------------
Improvements were made to to the API to reduce the boilerplate needed to
set up a state service. To upgrade, do the following.

1. Run `ember install ember-state-services`.  
   Ensure your `package.json` was updated to a 2.x flavor of the add-on.
2. Remove existing
   [services](https://github.com/stefanpenner/ember-state-services/tree/v1.0.0#service) that used the `StateMixin`.  
   You can easily remove these services and their
   corresponding tests by running `ember d service <old-state-service-name>`.
3. Modify existing code usage of the state service.

   You probably used to have usage like this in your component:
   ```javascript
   export default Ember.Component.extend({
     editEmailService: Ember.inject.service('email-edit'),
     state: Ember.computed('email', function() {
       return this.editEmailService.stateFor(this.get('email'));
     }).readOnly()
   });
   ```

   The equivalent in 2.x syntax is:
   ```javascript
   import stateFor from 'ember-state-services/state-for';

   export default Ember.Component.extend({
     state: stateFor('email-edit', 'email')
   });
   ```

   And you'll need to update your state file to setup the initial state. In
   the 1.x example above, you'd automatically get the state of `email` when
   you called `stateFor(this.get('email'))`. To keep this behavior in 2.x,
   you need to modify your state like this:

   ```javascript
   const EmailEditState = Ember.Object.extend();

   EmailEditState.reopenClass({
     initialState() {
       return {
         content: this.get('email')
       };
     }
   });

   export default EmailEditState;
   ```

   or, if you're using `BufferedProxy`, like this:

   ```javascript
   const EmailEditState = BufferedProxy.extend();

   EmailEditState.reopenClass({
     initialState() {
       return {
         content: this.get('email')
       };
     }
   });

   export default EmailEditState;
   ```

For more granular information, check out the
[diff](https://github.com/stefanpenner/ember-state-services/compare/v1.0.0...v2.0.0).
