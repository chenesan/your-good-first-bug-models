module.exports = (function(){
  var Sequelize = require('sequelize');

  const connection  = new Sequelize(
    process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
    logging: () => {},
  });

  var Project = connection.define('project', {
    description: {
      type: Sequelize.STRING(1000),
      field: 'description',
    },
    name: {
      type: Sequelize.STRING,
      field: 'name',
      unique: 'name_url',
    },
    popularity: {
      type: Sequelize.INTEGER,
      field: 'popularity',
    },
    // size of codebase (kb)
    size: {
      type: Sequelize.INTEGER,
      field: 'size',
    },
    url: {
      type: Sequelize.STRING(2083),
      field: 'url',
      unique: 'name_url',
    },
  }, {
    createdAt: false,
  });

  var Issue = connection.define('issue', {
    title: {
      type: Sequelize.STRING(900),
      field: 'title',
      unique: 'title_url',
    },
    url: {
      type: Sequelize.STRING(2083),
      field: 'url',
      unique: 'title_url',
    },
    created_at: {
      type: Sequelize.DATE,
      field: 'created_at',
    },
  }, {
    createdAt: false,
  });
  Project.hasMany(Issue);
  Issue.belongsTo(Project);

  var Language = connection.define('language', {
    name: {
      type: Sequelize.STRING(30),
      field: 'name',
      unique: true,
    }
  }, {
    createdAt: false,
  });
  Language.hasMany(Project);
  Project.belongsTo(Language);

  connection.sync();

  return {
    Issue,
    Language,
    Project
  };
})();
