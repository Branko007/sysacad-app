import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Materia from './Materia.js';

const Clase = sequelize.define('Clase', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    horaInicio: {
        type: DataTypes.TIME,
        allowNull: false
    },
    horaFin: {
        type: DataTypes.TIME,
        allowNull: false
    },
    tema: {
        type: DataTypes.STRING,
        allowNull: true
    },
    modalidad: {
        type: DataTypes.ENUM('presencial', 'virtual'),
        defaultValue: 'presencial'
    },
    ubicacion: {
        type: DataTypes.STRING,
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
    tableName: 'clases',
    timestamps: false
});

// Relaciones
Materia.hasMany(Clase, { foreignKey: 'materiaId' });
Clase.belongsTo(Materia, { foreignKey: 'materiaId' });

export default Clase;
