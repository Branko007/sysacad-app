import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Materia = sequelize.define('Materia', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    anio: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    planId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    especialidadId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'materias',
    timestamps: false
});

export default Materia;
