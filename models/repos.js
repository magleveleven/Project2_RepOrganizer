module.exports = function(sequelize, DataTypes) {
    const Repo = sequelize.define('Repo', {
      repoID: DataTypes.STRING,
      repoName: DataTypes.STRING,
      repoURL: DataTypes.STRING,
      repoPrivate: DataTypes.BOOLEAN,
      timestamp: DataTypes.DATE,
    });
    return Repo;
  };
  