// repoID: DataTypes.STRING,
module.exports = function(sequelize, DataTypes) {
    const RepoTag = sequelize.define('RepoTag', {
      tagID: DataTypes.STRING,
      repoID: DataTypes.INTEGER,
    });
  
    return RepoTag;
  };