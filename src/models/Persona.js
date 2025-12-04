import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Persona = sequelize.define('Persona', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nroDocumento: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    tipoDocumento: {
        type: DataTypes.ENUM('dni', 'libretaCivica', 'libretaEnrolamiento', 'pasaporte'),
        allowNull: false
    },
    fechaNacimiento: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    genero: {
        type: DataTypes.STRING,
        allowNull: true
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: true
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    }
}, {
    tableName: 'personas',
    timestamps: false
});

export default Persona;
