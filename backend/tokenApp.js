//Se encarga de comprobar si el correo se encuentra registrado.
//Si es asi, se le genera un token para el usuario que es el 
//dueño del correo para que pueda utilizar los servicios del server.
const models = require('./models');
const generadorToken = require("./generadorToken");

const correo = 'juan1996@gmail.com';

const verificarUsuarioPorCorreo = async function(email){

    let token = '';
    const personas = await models.Persona.findAll();
    let encontrado = false;

    personas.forEach(persona => {
        if(persona.email == email){
            token = generadorToken.generarToken(email,persona.nombre);
            console.log("Esta persona puede usar los servicios del backend");
            encontrado=true;
        }

    });

    if(!encontrado){
        console.log("Persona no encontrada/registrada");
    }

    return token;
}

//verificarUsuarioPorCorreo(correo);
exports.verificarUsuarioPorCorreo = verificarUsuarioPorCorreo;


