import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const TipoDedicacion = sequelize.define('TipoDedicacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    horasSemanales: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    observacion: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'tipos_dedicacion',
    timestamps: true
});

export default TipoDedicacion;
