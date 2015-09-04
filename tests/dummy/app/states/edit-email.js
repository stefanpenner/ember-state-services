import BufferedProxy from 'ember-buffered-proxy/proxy';

BufferedProxy.reopenClass({
  initialState() {
    return { content: this.get('email') };
  }
});

export default BufferedProxy.extend();
