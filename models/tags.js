module.exports = function(sequelize, DataTypes) {
    const Tag = sequelize.define('Tag', {
      tagName: DataTypes.STRING,
      tagColor: DataTypes.STRING,
    });
  
    return Tag;
  };
  