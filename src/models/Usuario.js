import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Persona from './Persona.js';

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombreUsuario: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rol: {
    type: DataTypes.ENUM('admin', 'profesor', 'alumno'),
    allowNull: false
  },
  personaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Persona,
      key: 'id'
    }
  }
}, {
  tableName: 'usuarios',
  timestamps: false
});

// Definir la relación
Persona.hasOne(Usuario, { foreignKey: 'personaId' });
Usuario.belongsTo(Persona, { foreignKey: 'personaId' });

export default Usuario;