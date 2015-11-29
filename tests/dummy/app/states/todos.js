import BufferedProxy from 'ember-buffered-proxy/proxy';

const TodosProxy = BufferedProxy.extend();

TodosProxy.reopenClass({
  initialState(instance) {
    return {
      content: instance.get('todo')
    };
  }
});

export default TodosProxy;
