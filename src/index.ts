import { Application } from 'probot';
import handles from './handles';

module.exports = (app: Application) => {
  app.on('installation.created', handles.installation.created);
};
