import request from "supertest";
import app from "../../app.js"; // Importamos la app configurada

describe("Servidor Sysacad", () => {
  it("Debería responder con mensaje en la ruta raíz (/)", async () => {
    const res = await request(app).get("/");

    // Verificamos que devuelva status 200
    expect(res.statusCode).toBe(200);

    // Verificamos el mensaje esperado
    expect(res.text).toBe("Sistema Académico en funcionamiento");
  });
});
