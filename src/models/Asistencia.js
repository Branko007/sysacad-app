import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Clase from './Clase.js';
import Alumno from './Alumno.js';

const Asistencia = sequelize.define('Asistencia', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    presente: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    justificada: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    observaciones: {
        type: DataTypes.STRING,
        allowNull: true
    },
    claseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Clase,
            key: 'id'
        }
    },
    alumnoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Alumno,
            key: 'id'
        }
    }
}, {
    tableName: 'asistencias',
    timestamps: false
});

// Relaciones
Clase.hasMany(Asistencia, { foreignKey: 'claseId' });
Asistencia.belongsTo(Clase, { foreignKey: 'claseId' });

Alumno.hasMany(Asistencia, { foreignKey: 'alumnoId' });
Asistencia.belongsTo(Alumno, { foreignKey: 'alumnoId' });

export default Asistencia;
