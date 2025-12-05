import sequelize from '../config/database.js';
import Cargo from './Cargo.js';
import CategoriaCargo from './CategoriaCargo.js';
import TipoDedicacion from './TipoDedicacion.js';
import Grupo from './Grupo.js';

const db = {
    sequelize,
    Cargo,
    CategoriaCargo,
    TipoDedicacion,
    Grupo
};

export default db;
