import BufferedProxy from 'ember-buffered-proxy/proxy';

BufferedProxy.reopenClass({
  initialState() {
    return {
      content: this.get('todo')
    };
  }
});

export default BufferedProxy.extend();
