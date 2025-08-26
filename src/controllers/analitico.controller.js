
import PDFDocument from 'pdfkit';
import { AnaliticoService } from '../services/analitico.service.js';

const service = new AnaliticoService();

export const generarAnaliticoPDF = async (req, res) => {
  const alumnoId = Number(req.params.alumnoId);

  // 1) Obtener los datos de dominio (alumno, materias, notas, promedios, etc.)
  const data = await service.obtenerAnalitico(alumnoId);
  if (!data) return res.status(404).json({ error: 'Alumno no encontrado' });

  // 2) Armar PDF
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="analitico_${alumnoId}.pdf"`);

  doc.pipe(res);

  // Encabezado
  doc.fontSize(18).text('Analítico de Alumno', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(12).text(`Alumno: ${data.alumno.nombre}  |  DNI: ${data.alumno.dni}`);
  doc.text(`Legajo: ${data.alumno.legajo}  |  Carrera: ${data.alumno.carrera}`);
  doc.moveDown();

  // Tabla simple de materias
  doc.fontSize(13).text('Materias y Calificaciones', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(11);

  const header = ['Código', 'Materia', 'Fecha', 'Nota', 'Estado'];
  const widths = [70, 220, 80, 50, 100];

  // Header
  header.forEach((h, i) => doc.text(h, doc.x + (i === 0 ? 0 : widths.slice(0, i).reduce((a, b) => a + b, 0)), doc.y, { continued: i < header.length - 1, width: widths[i] }));
  doc.moveDown(0.5);

  // Filas
  data.materias.forEach(m => {
    const row = [m.codigo, m.nombre, m.fecha, String(m.nota ?? ''), m.estado];
    row.forEach((val, i) => {
      doc.text(val, doc.x + (i === 0 ? 0 : widths.slice(0, i).reduce((a, b) => a + b, 0)), doc.y, { continued: i < row.length - 1, width: widths[i] });
    });
    doc.moveDown(0.3);
  });

  doc.moveDown();
  doc.fontSize(12).text(`Promedio general: ${data.promedio}`, { align: 'right' });

  // Footer
  doc.moveDown(2);
  doc.fontSize(10).text(`Emitido: ${new Date().toLocaleString('es-AR')}`, { align: 'right' });

  doc.end();
};
