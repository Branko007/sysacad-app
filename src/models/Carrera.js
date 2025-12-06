import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Facultad from './facultad.js';

const Carrera = sequelize.define('Carrera', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    codigo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    duracionAnios: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nivel: {
        type: DataTypes.ENUM('grado', 'pregrado', 'posgrado'),
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('activa', 'inactiva'),
        defaultValue: 'activa'
    },
    facultadId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Facultad,
            key: 'id'
        }
    }
}, {
    tableName: 'carreras',
    timestamps: false
});

// Relación
Facultad.hasMany(Carrera, { foreignKey: 'facultadId' });
Carrera.belongsTo(Facultad, { foreignKey: 'facultadId' });

export default Carrera;
