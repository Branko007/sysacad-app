import { MateriaEntity } from '../../entities/materia.entity.js';

describe('MateriaEntity', () => {
  const mockMateria = {
    id: 10,
    nombre: 'Análisis Matemático I',
    especialidadId: 1,
    planId: 2020,
    anio: 1,
  };

  it('debe crearse correctamente desde el constructor', () => {
    const materia = new MateriaEntity(mockMateria);

    expect(materia.id).toBe(10);
    expect(materia.nombre).toBe('Análisis Matemático I');
    expect(materia.especialidadId).toBe(1);
    expect(materia.planId).toBe(2020);
    expect(materia.anio).toBe(1);
  });

  it('toJSON debe serializar las propiedades esperadas', () => {
    const materia = new MateriaEntity(mockMateria);
    expect(materia.toJSON()).toEqual({
      id: 10,
      nombre: 'Análisis Matemático I',
      especialidadId: 1,
      planId: 2020,
      anio: 1,
    });
  });

  it('fromModel debe crear la entidad desde un “modelo” (objeto) compatible', () => {
    const modelInstance = { ...mockMateria, extra: 'ignorar' }; // campo extra no usado
    const materia = MateriaEntity.fromModel(modelInstance);

    expect(materia).toBeInstanceOf(MateriaEntity);
    expect(materia.id).toBe(10);
    expect(materia.nombre).toBe('Análisis Matemático I');
  });

  it('toJSON no debe incluir propiedades adicionales', () => {
    const materia = new MateriaEntity({ ...mockMateria });
    const json = materia.toJSON();

    const expectedKeys = ['id', 'nombre', 'especialidadId', 'planId', 'anio'].sort();
    const actualKeys = Object.keys(json).sort();

    expect(actualKeys).toEqual(expectedKeys);
  });
});