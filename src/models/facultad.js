import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Facultad = sequelize.define('Facultad', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
  // TODO: Agregar aquí universidadId cuando implementes el modelo Universidad
}, {
  tableName: 'facultades',
  timestamps: false
});

export default Facultad;