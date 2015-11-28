import BufferedProxy from 'ember-buffered-proxy/proxy';

const TodosProxy = BufferedProxy.extend();

TodosProxy.reopenClass({
  initialState(consumerContext) {
    return {
      content: consumerContext.get('todo')
    };
  }
});

export default TodosProxy;
