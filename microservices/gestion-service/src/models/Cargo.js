import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import CategoriaCargo from './CategoriaCargo.js';

const Cargo = sequelize.define('Cargo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    puntos: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'cargos',
    timestamps: true
});

// Relación 1-1: Cargo tiene una CategoriaCargo
Cargo.belongsTo(CategoriaCargo, { foreignKey: 'categoriaCargoId' });
CategoriaCargo.hasOne(Cargo, { foreignKey: 'categoriaCargoId' });

export default Cargo;
