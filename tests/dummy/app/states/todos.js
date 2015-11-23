import BufferedProxy from 'ember-buffered-proxy/proxy';

const TodosProxy = BufferedProxy.extend();

TodosProxy.reopenClass({
  initialState() {
    return {
      content: this.get('todo')
    };
  }
});

export default TodosProxy;
