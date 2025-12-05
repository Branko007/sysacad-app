import db from '../models/index.js';

const { Cargo, CategoriaCargo, TipoDedicacion, Grupo } = db;

export const getCargos = async (req, res) => {
    try {
        const cargos = await Cargo.findAll({ include: CategoriaCargo });
        res.json(cargos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createCargo = async (req, res) => {
    try {
        const cargo = await Cargo.create(req.body);
        res.status(201).json(cargo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCategorias = async (req, res) => {
    try {
        const categorias = await CategoriaCargo.findAll();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createCategoria = async (req, res) => {
    try {
        const categoria = await CategoriaCargo.create(req.body);
        res.status(201).json(categoria);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTiposDedicacion = async (req, res) => {
    try {
        const tipos = await TipoDedicacion.findAll();
        res.json(tipos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createTipoDedicacion = async (req, res) => {
    try {
        const tipo = await TipoDedicacion.create(req.body);
        res.status(201).json(tipo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getGrupos = async (req, res) => {
    try {
        const grupos = await Grupo.findAll();
        res.json(grupos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createGrupo = async (req, res) => {
    try {
        const grupo = await Grupo.create(req.body);
        res.status(201).json(grupo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
