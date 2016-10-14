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
    },
  }, {
    createdAt: false,
    indexes: [{
      name: 'name_url',
      type: 'unique',
      fields: [
        {
          attribute: 'url',
          length: 100,
        },
        {
          attribute: 'name',
          length: 100,
        },
      ],
    }],
  });

  var Issue = connection.define('issue', {
    title: {
      type: Sequelize.STRING(900),
      field: 'title',
    },
    url: {
      type: Sequelize.STRING(2083),
      field: 'url',
    },
    createdAt: {
      type: Sequelize.DATE,
      field: 'createdAt',
    },
  }, {
    createdAt: false,
    indexes: [{
      name: 'title_url',
      type: 'unique',
      fields: [
        {
          attribute: 'title',
          length: 100,
        },
        {
          attribute: 'url',
          length: 100,
        },
      ],
    }],
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
