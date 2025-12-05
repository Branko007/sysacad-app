import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Grupo = sequelize.define('Grupo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING
    },
    codigo: {
        type: DataTypes.STRING,
        unique: true
    },
    materiaId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Puede ser nulo si no se ha asignado o si la materia no existe en este microservicio
        comment: 'ID de la materia en el servicio Academico'
    }
}, {
    tableName: 'grupos',
    timestamps: true
});

export default Grupo;
