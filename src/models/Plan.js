import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Carrera from './Carrera.js';

const Plan = sequelize.define('Plan', {
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
    fechaInicio: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    fechaFin: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    resolucion: {
        type: DataTypes.STRING,
        allowNull: true
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    carreraId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Carrera,
            key: 'id'
        }
    }
}, {
    tableName: 'planes',
    timestamps: false
});

// Relación
Carrera.hasMany(Plan, { foreignKey: 'carreraId' });
Plan.belongsTo(Carrera, { foreignKey: 'carreraId' });

export default Plan;
