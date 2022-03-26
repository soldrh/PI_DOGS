const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('dogs', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      },
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    heightMin: {
      type: DataTypes.STRING,
      allowNull: false
    },
    heightMax: {
      type: DataTypes.STRING,
      allowNull: false
    },
    weightMin: {
      type: DataTypes.STRING,
      allowNull: false
    },
    weightMax: {
      type: DataTypes.STRING,
      allowNull: false
    },
    life_span: {
      type: DataTypes.STRING,
      allowNull: true
    },
      createdInDb: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });
};
