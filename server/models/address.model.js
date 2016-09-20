'use strict';

module.exports = (sequelize, DataTypes) => {
  let models;
  let Address;

  Address = sequelize.define('Address', {
    address1: DataTypes.STRING,
    address2: DataTypes.STRING,
    apt_suite: DataTypes.STRING,
    city: DataTypes.STRING,
    state_province: DataTypes.STRING,
    postal_code: DataTypes.STRING,
    country: DataTypes.STRING
  }, {
    tableName: 'addresses',
    timestamps: true,
    classMethods: {
      init: function (_models) {
        models = _models;
        Address.belongsTo(models.User)
      }
    }
  });
  return Address;
};

