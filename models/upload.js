'use strict';

let config = require('../config/config');

module.exports = (sequelize, DataTypes) => {
  let Upload = sequelize.define('Upload', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: DataTypes.STRING,
    slug: DataTypes.STRING,
    path: DataTypes.STRING,
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  });

  Upload.prototype.uploadPayload = function(){
    let createdAt = new Date(this.createdAt).toLocaleDateString("en-US",
      {year:"numeric",month:"short", day:"2-digit"})
    return {
      slug: this.slug,
      path: this.path,
      url: `https://${config.appHost}/uploads/${this.slug}`,
      views: this.views,
      createdAt: createdAt
    }
  }

  return Upload
};
