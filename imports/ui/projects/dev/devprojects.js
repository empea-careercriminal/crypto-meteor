import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';


import './devprojects.html';

import { ReactiveDict } from 'meteor/reactive-dict';
import { Projects } from '../../../api/projects.js';
import '../../entity/project.js';

Template.DevProjects.onCreated(function devProjectsOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('projects');
});

Template.DevProjects.helpers({
  projects() {
    const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      // If hide completed is checked, filter projects
      return Projects.find({ coinType: { $eq: "dev" } }, { sort: { createdAt: -1 } });
    }
    // Otherwise, return all of the Projects
    return Projects.find({ coinType: { $eq: "dev" }  }, { sort: { createdAt: -1 } });
  }
});

Template.DevProjects.events({
  'change .hide-completed input'(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  }
});