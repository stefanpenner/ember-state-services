import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return Ember.A([
      { id: 1, subject: 'Recruiter spam',            from: 'some@example.com', body: 'long message' },
      { id: 2, subject: 'other Recruiter spam',      from: 'some@example.com', body: 'long message' },
      { id: 3, subject: 'more Recruiter spam',       from: 'some@example.com', body: 'long message' },
      { id: 4, subject: 'additional Recruiter spam', from: 'some@example.com', body: 'long message' },
    ]);
  }
});
