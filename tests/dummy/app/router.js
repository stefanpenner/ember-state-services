import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {

  this.route('todos', { path: '/todos/:status' }, function() {
    this.route('todo-message',  { path: '/:todo_id' } );
  });

  this.route('todos.new', { path: '/todos/new' });
});

export default Router;
