// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Require Axios
const axios = require('axios');

// Grabbing our models
const db = require('../models');

// Routes
// =============================================================
module.exports = function(app) {
  // GET route for getting all of the repos
  app.get('/api/repos', function(req, res) {
    // Get all the user's repos from GitHub using the graphQL api
    const url = 'https://api.github.com/graphql';

    axios({
      method: 'post',
      url,
      // uses .env
      auth: {
        username: process.env.GIT_USERNAME,
        password: process.env.GIT_PASSWORD,
      },
      data: {
        query: `{
          viewer {
            name
            repositories(first: 100) {
              nodes {
                id, name, url, isPrivate, updatedAt
              }
            }
          }
        }`,
      },
    })
      .then(response => {
        // handle success
        const repos = response.data.data.viewer.repositories.nodes;
        res.json(repos);
      })
      .catch(error => {
        // handle error
        console.log(error);
      });
  });

  // GET route for getting all of the repos from the db
  app.get('/api/dbRepos', function(req, res) {
    // findAll returns all entries for a table when used with no options
    db.Repo.findAll({}).then(function(dbRepo) {
      // We have access to the repos as an argument inside of the callback function
      res.json(dbRepo);
    });
  });

  // GET route for getting all of the repo tags from the db
  app.get('/api/dbRepoTags', function(req, res) {
    // findAll returns all entries for a table when used with no options
    db.RepoTag.findAll({}).then(function(dbRepoTags) {
      // We have access to the repos as an argument inside of the callback function
      res.json(dbRepoTags);
    });
  });

  // POST route for saving a new repo
  app.post('/api/repos', function(req, res) {
    console.log(req.body);

    // Use async so the repos are all inserted before we try to find them
    async function insertRepos() {
      for (let i = 0; i < req.body.newRepos.length; i++) {
        console.log(req.body.newRepos[i].repoID);

        // Insert the new repo
        await db.Repo.create({
          repoID: req.body.newRepos[i].repoID,
          repoName: req.body.newRepos[i].repoName,
          repoURL: req.body.newRepos[i].repoURL,
          repoPrivate: req.body.newRepos[i].repoPrivate,
          timestamp: req.body.newRepos[i].timestamp,
        });
      } // End loop over new repos

      // Need find all the new repos and send them back
      db.Repo.findAll({}).then(function(dbRepo) {
        // We have access to the repos as an argument inside of the callback function
        res.json(dbRepo);
      });
    }

    // Call the async function
    insertRepos();
  });

  // GET route for getting all of the tags
  app.get('/api/tags', function(req, res) {
    // Count how many tags
    db.Tag.count().then(c => {
      console.log(`There are ${c} tags!`);
      // If no Tags create the defaults
      if (c === 0) {
        db.Tag.bulkCreate([
          { tagName: 'HTML', tagColor: '#FFE933' },
          { tagName: 'CSS', tagColor: '#FF6E33' },
          { tagName: 'Node', tagColor: '#ABA6A5' },
          { tagName: 'JavaScript', tagColor: '#7E5B6C' },
          { tagName: 'JQUERY', tagColor: '#9116D8' },
        ]).then(Tags => {
          console.log(Tags);
          res.json(Tags);
        });
      } else {
        db.Tag.findAll({}).then(function(dbTag) {
          // We have access to the tags as an argument inside of the callback function
          res.json(dbTag);
        });
      }
    });
  });

  // GET route for getting all of the repo tags
  app.get('/api/repotags/:repoid', function(req, res) {
    // findAll returns all entries for a table when used with no options
    console.log('repoID Param', req.params.repoid);
    console.log(typeof req.params.repoid);
    console.log(req.params.repoid);
    const paramRepoID = parseInt(req.params.repoid);
    console.log(paramRepoID);

    db.RepoTag.findAll({
      where: { repoID: paramRepoID },
    }).then(function(dbRepoTag) {
      // We have access to the tags as an argument inside of the callback function
      res.json(dbRepoTag);
    });
  });

  // POST route for saving a new repo tag
  app.post('/api/repotags', function(req, res) {
    console.log('RepoID:', req.body.repoID);
    console.log(typeof req.body.repoID);

    const repoID = parseInt(req.body.repoID);

    console.log(typeof repoID);
    console.log(repoID);

    db.RepoTag.create({
      tagID: req.body.tagID,
      repoID,
    }).then(function(dbRepoTag) {
      // We have access to the new Repo Tag as an argument inside of the callback function
      res.json(dbRepoTag);
    });
  });

  // DELETE route for deleting repos. We can get the id of the repo tag to be deleted from
  // req.params.id
  app.delete('/api/repotags/:id', function(req, res) {
    // We just have to specify which repo we want to destroy with "where"
    console.log(req.params.id);

    db.RepoTag.destroy({
      where: {
        tagID: req.params.id,
      },
    }).then(function(dbRepoTags) {
      res.json(dbRepoTags);
    });
  });

  // POST route for saving a new repo tag
  app.post('/api/tag', function(req, res) {
    db.Tag.create({
      tagName: req.body.tagName,
      tagColor: req.body.tagColor,
    }).then(function(dbTag) {
      // We have access to the new tag as an argument inside of the callback function
      res.json(dbTag);
    });
  });

  // Update the tag name
  app.put('/api/tags', function(req, res) {
    console.log(req.body);
    // Update takes in an object describing the properties we want to update, and
    // we use where to describe which objects we want to update
    db.Tag.update(
      {
        tagName: req.body.tagName,
      },
      {
        where: {
          id: req.body.id,
        },
      }
    ).then(function(dbTag) {
      res.json(dbTag);
    });
  });

  // Delete the tag name
  app.delete('/api/tags/:id', function(req, res) {
    // We just have to specify which tag we want to destroy with "where"
    db.Tag.destroy({
      where: {
        id: req.params.id,
      },
    }).then(function(dbTag) {
      res.json(dbTag);
    });
  });
};