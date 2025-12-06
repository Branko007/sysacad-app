import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Alumno from './Alumno.js';
import Evaluacion from './Evaluacion.js';

const Calificacion = sequelize.define('Calificacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nota: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    fechaRegistro: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    observaciones: {
        type: DataTypes.STRING,
        allowNull: true
    },
    estado: {
        type: DataTypes.ENUM('aprobado', 'desaprobado', 'ausente'),
        allowNull: false
    },
    alumnoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Alumno,
            key: 'id'
        }
    },
    evaluacionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Evaluacion,
            key: 'id'
        }
    }
}, {
    tableName: 'calificaciones',
    timestamps: false
});

// Relaciones
Alumno.hasMany(Calificacion, { foreignKey: 'alumnoId' });
Calificacion.belongsTo(Alumno, { foreignKey: 'alumnoId' });

Evaluacion.hasMany(Calificacion, { foreignKey: 'evaluacionId' });
Calificacion.belongsTo(Evaluacion, { foreignKey: 'evaluacionId' });

export default Calificacion;
