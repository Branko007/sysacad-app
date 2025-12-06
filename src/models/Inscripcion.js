import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Alumno from './Alumno.js';
import Materia from './Materia.js';

const Inscripcion = sequelize.define('Inscripcion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fechaInscripcion: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    aprobada: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    observaciones: {
        type: DataTypes.STRING,
        allowNull: true
    },
    cicloLectivo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    periodo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    alumnoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Alumno,
            key: 'id'
        }
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
    tableName: 'inscripciones',
    timestamps: false
});

// Relaciones
Alumno.belongsToMany(Materia, { through: Inscripcion, foreignKey: 'alumnoId', otherKey: 'materiaId' });
Materia.belongsToMany(Alumno, { through: Inscripcion, foreignKey: 'materiaId', otherKey: 'alumnoId' });
Inscripcion.belongsTo(Alumno, { foreignKey: 'alumnoId' });
Inscripcion.belongsTo(Materia, { foreignKey: 'materiaId' });
Alumno.hasMany(Inscripcion, { foreignKey: 'alumnoId' });
Materia.hasMany(Inscripcion, { foreignKey: 'materiaId' });

export default Inscripcion;
