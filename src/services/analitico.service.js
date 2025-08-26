import { AnaliticoRepository } from '../repositories/analitico.repository.js';

export class AnaliticoService {
  constructor(repo = new AnaliticoRepository()) {
    this.repo = repo;
  }

  async obtenerAnalitico(alumnoId) {
    const base = await this.repo.fetchAnaliticoData(alumnoId);
    if (!base) return null;

    // Calcular promedio simple (ignorando materias sin nota)
    const notas = base.materias.map(m => m.nota).filter(n => typeof n === 'number');
    const promedio = notas.length ? (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(2) : 'N/D';

    return { ...base, promedio };
  }
}
