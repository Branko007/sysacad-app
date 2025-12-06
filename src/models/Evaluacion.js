import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Materia from './Materia.js';

const Evaluacion = sequelize.define('Evaluacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    tipo: {
        type: DataTypes.ENUM('parcial', 'final', 'recuperatorio', 'tp'),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ponderacion: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    materiaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Materia,
            key: 'id'
        }
    }
}, {
    tableName: 'evaluaciones',
    timestamps: false
});

// Relación
Materia.hasMany(Evaluacion, { foreignKey: 'materiaId' });
Evaluacion.belongsTo(Materia, { foreignKey: 'materiaId' });

export default Evaluacion;
