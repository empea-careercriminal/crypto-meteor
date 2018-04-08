import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';


import './projects.html';

import { ReactiveDict } from 'meteor/reactive-dict';
import { Projects } from '../../api/projects.js';
import '../entity/project.js';

Template.Projects.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  console.log("jotasks");
  Meteor.subscribe('projects');
});





Template.Projects.helpers({
  projects() {
    const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      // If hide completed is checked, filter projects
      return Projects.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
    // Otherwise, return all of the Projects
    return Projects.find({}, { sort: { createdAt: -1 } });
  },
  incompleteCount() {
    return Projects.find({ checked: { $ne: true } }).count();
  },
});

Template.Projects.events({

  'submit .new-project'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;
    console.log("josubmit")
    // Insert a task into the collection
    Meteor.call('projects.insert', text);

    // Clear form
    target.text.value = '';
  },
  'change .hide-completed input'(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  }
});