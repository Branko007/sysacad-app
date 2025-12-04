export class PersonaEntity {
    constructor({ id, apellido, nombre, nroDocumento, tipoDocumento, fechaNacimiento, genero, direccion, telefono, email }) {
        this.id = id;
        this.apellido = apellido;
        this.nombre = nombre;
        this.nroDocumento = nroDocumento;
        this.tipoDocumento = tipoDocumento;
        this.fechaNacimiento = fechaNacimiento;
        this.genero = genero;
        this.direccion = direccion;
        this.telefono = telefono;
        this.email = email;
    }

    static fromModel(modelInstance) {
        const { id, apellido, nombre, nroDocumento, tipoDocumento, fechaNacimiento, genero, direccion, telefono, email } = modelInstance;
        return new PersonaEntity({ id, apellido, nombre, nroDocumento, tipoDocumento, fechaNacimiento, genero, direccion, telefono, email });
    }

    toJSON() {
        return {
            id: this.id,
            apellido: this.apellido,
            nombre: this.nombre,
            nroDocumento: this.nroDocumento,
            tipoDocumento: this.tipoDocumento,
            fechaNacimiento: this.fechaNacimiento,
            genero: this.genero,
            direccion: this.direccion,
            telefono: this.telefono,
            email: this.email
        };
    }
}
