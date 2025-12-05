import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CategoriaCargo = sequelize.define('CategoriaCargo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nivel: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'categorias_cargos',
    timestamps: true
});

export default CategoriaCargo;
