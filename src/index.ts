import { Application } from 'probot';

module.exports = (app: Application) => {
  app.on('installation.created', async context => {
    console.log('Hello World!');
  });
};
