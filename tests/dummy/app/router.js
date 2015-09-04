import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {

  this.route('todos', { path: '/todos/:status' }, function() {
    this.route('todo-message',  { path: '/:todo-id' } );
  });

  this.route('todos.new', { path: '/todos/new' });
});

export default Router;
