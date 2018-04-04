import { computed } from '@ember/object';
import Component from '@ember/component';
import stateFor from 'ember-state-services/state-for';

export default Component.extend({
  data: stateFor('todos', 'todo'),

  isDraft: computed('data.{isEditing,title,body}', function() {
    var todoTitle = this.get('todo.title');
    var todoBody = this.get('todo.body');
    var dataTitle = this.get('data.title');
    var dataBody = this.get('data.body');

    if (!this.get('data.isEditing')) {
      return false;
    }

    if (todoTitle !== dataTitle || todoBody !== dataBody) {
      return true;
    }

    return false;
  })
});
