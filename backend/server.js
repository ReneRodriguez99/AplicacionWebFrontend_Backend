const cors = require("cors");
const express = require("express");
const app = express();
const fs = require("fs");
const https = require("https");

process.env.port = 3001;

const llavePrivada = fs.readFileSync("private.key");
const certificado = fs.readFileSync("certificate.crt");
const credenciales = {
    key: llavePrivada,
    cert: certificado,
    passphrase: "2002" //password de la llave privada usado en la creacion del certificado.
};
const httpsServer = https.createServer(credenciales,app);


const personaRouter = require("./routes/persona");
const proyectoRouter = require("./routes/proyecto");
const donadorRouter = require("./routes/donador");
const token = require("./tokenApp");
const bodyParser = require('body-parser');

//let correo = 'rene.yahir.rodriguez.robledo@uabc.edu.mx'; //correo de prueba.
let tokenRecibido = '';

app.use(bodyParser.json());

app.use(cors());
app.use(express.json());

app.use("/persona" ,personaRouter);
app.use("/proyecto" ,proyectoRouter);
app.use("/donador" ,donadorRouter);


app.post('/server', async (req, res) => { //Recibe un correo enviado por el frontend.

    correo = req.body.variable;
   
    console.log('Email:', correo);
    tokenRecibido =  await token.verificarUsuarioPorCorreo(correo);
    console.log("token:", tokenRecibido);

    // Enviar una respuesta de vuelta al cliente si es necesario.
    res.json({ mensaje: 'Email recibido correctamente' });
});


app.get('/enviar', (req, res) => { //el backend envia el token generado al frontend.
    try {
        const tokenDesdeBackend = tokenRecibido;
        res.json({ tokenDesdeBackend });
    } catch (error) {
        console.error('Error en la ruta /enviar', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


//app.listen(3001, ()=>{
//    console.log("Server en puerto 3001");
//});



httpsServer.listen(process.env.port, () => {
    console.log('servidor https escuchando por el puerto: ',process.env.port);
}).on('error', err => {
    console.log('Error al iniciar el servidor:', err);
});


