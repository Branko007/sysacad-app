import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Persona from './Persona.js';

const Profesor = sequelize.define('Profesor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    legajo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    fechaIngreso: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    especialidad: {
        type: DataTypes.STRING,
        allowNull: true
    },
    antigüedad: {
        type: DataTypes.INTEGER,
        allowNull: true
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
    tableName: 'profesores',
    timestamps: false
});

// Definir la relación
Persona.hasOne(Profesor, { foreignKey: 'personaId' });
Profesor.belongsTo(Persona, { foreignKey: 'personaId' });

export default Profesor;
