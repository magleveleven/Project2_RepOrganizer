# Project2_RepOrganizer

https://reporganizer.herokuapp.com/

Opportunity
Create an easy to use interface for developers to find and sort their Repositories from GitHub.
Solution
Leverage GitHub Rest API and GraphQL API
Create custom tables with relevant Repo data points for organizational flexibility
Technologies
AJAX
Axios
Node
Require
Express
Sequelize
MySQL
JavaScript
JQUERY
Heroku
Implementation
Model, View, Controller

Model: 3 tables created with Sequelize - Repository name, URL, ID, - Tag name, color, - One to Many Repo:Tags

View: User interface to add attridbute, such as flag/color - Use API routing to point to data - Leveraging JQUERY for editing records/rows

Controller: Handles all requests - Grabs and edits data from database / tables - Pushes data to user / UI

Detailed Flow
Use GitHub credentials to call GitHub API, pull data: respository name, url, private/public indicator,
Create database with sequelize and 3 tables: 1 containing GitHub API details, 1 containing tag names, and colors, and 1 that will be used to add/remove tags to repositories (a one to many table).
Create API routes to access the data
Create JS functions for capturing count of repositories to create equal number of cards, images, and buttons to display, a critical component to the UI.
Create async functions to compare GitHub with RepOrganizer in case new Repo files have been created so RepOrganizer can load newly created files too
Create add buttons for tags, and ability to remove, using pop up features for users
Have UI provide user ability to sort by tags
Provide users ability to create new tags, and edit names of tags, and remove/delete tags.