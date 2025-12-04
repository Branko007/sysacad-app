import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Persona from './Persona.js';

const Alumno = sequelize.define('Alumno', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nroLegajo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    fechaIngreso: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    regularidad: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    cohorte: {
        type: DataTypes.INTEGER,
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
    tableName: 'alumnos',
    timestamps: false
});

// Definir la relación
Persona.hasOne(Alumno, { foreignKey: 'personaId' });
Alumno.belongsTo(Persona, { foreignKey: 'personaId' });

export default Alumno;
