<template>
    <div ref="googleLoginBtn" class="btn_google"></div>
  </template>
  
  <script setup>
  //inicio de sesion y autenticacion con google.
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import tokenService from './tokenService';
  const mensaje = ref('');

  const router = useRouter();
  
  const googleLoginBtn = ref(null);
  
  onMounted(() => {
    console.log("CLIENT ID", import.meta.env.VITE_ID_CLIENT_GOOGLE);
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_ID_CLIENT_GOOGLE,
      callback: onSuccess,
      context: 'signin',
      auto_select: false,
      //  scope: process.env.VUE_APP_GOOGLE_SCOPES,
      referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
      },
    });
    window.google.accounts.id.renderButton(
      googleLoginBtn.value,
      {
        text: 'signin_with',
        size: 'large',
        width: '366',
        theme: 'outline',
        logo_alignment: 'center',
      }
    );
  });
  
  function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  
    return JSON.parse(jsonPayload);
  }
  
  //Verifica si el token enviado es autentico y fue generado por el mismo google.
  async function verifyGoogleToken(idToken) { 
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/tokeninfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_token: idToken }),
      });
  
      if (!response.ok) {
        throw new Error(`Error al verificar el token de Google: ${response.statusText}`);
      }
  
      const tokenInfo = await response.json();
      return tokenInfo;
    } catch (error) {
      console.error('Error al verificar el token de Google:', error.message);
      return null;
    }
  }
  

    async function enviarEmailBackend(email) { //el frontend envia el email al backend para la autenticacion.
        try {
            console.log(email);
            const response = await axios.post('https://localhost:3001/server', {
            variable: email,
            });

            console.log(response.data);
        } catch (error) {
          
            console.error('Error al enviar el correo al backend:', error);
        }
    }   

    async function recibirTokenDelBackend() { //el frontend recibe el token enviado por el backend.
        try {
            const response = await axios.get('https://localhost:3001/enviar');
            
            // Verifica si la propiedad esperada esta presente en la respuesta.
            if ('tokenDesdeBackend' in response.data) {
            return response.data.tokenDesdeBackend;
            } else {
            console.error('El token no esta presente en la respuesta del backend.');
            return null;
            }

        } catch (error) {
            console.error('Error al obtener el token desde el backend:', error);
            return null;
        }
    }

    async function enviarYRecibirDatos(correo) {
        let token = "";
        try {
        
            await enviarEmailBackend(correo);

            // Esperar a que se complete el envio antes de recibir el token del backend.
            token = await recibirTokenDelBackend();

            
            if (token !== null && token !== undefined) {
                console.log('Token recibido del backend:', token);
            } else {
                console.error('El token recibido es null o undefined.');
            }


            mensaje.value = token;

            return token;

        } catch (error) {
            console.error('Error al enviar o recibir la variable:', error);

            return token;
        }
    }


  function onSuccess(googleUser) {
    const id_token = googleUser.credential;
    
    verifyGoogleToken(id_token)
      .then((tokenInfo) => {
        if (tokenInfo && tokenInfo.aud === import.meta.env.VITE_ID_CLIENT_GOOGLE) {
  
          console.log('Token valido');
          
          const user = parseJwt(id_token);
          const name = user.name;
          const imgURL = user.picture;
          const email = user.email;
          console.log(user);
          console.log('Nombre:', name);
          console.log('Imagen:', imgURL);
          console.log('Correo electrónico:', email);

          const token = enviarYRecibirDatos(email);

          if(token==""){ //Si el campo no es vacio significa que se genero un token. El usuario puede usar el server.
            console.log("Error de autenticacion");
            router.push('/errorLogin'); //Muestra que hubo error en autenticarse, porque no encontro el correo registrado en la base de datos.
          }
          else{
            tokenService.setToken(token); //guardamos el token.
            router.push('/personas'); //lo envia a la tabla de personas.
            
          }


        } else {
          
          console.log('Token no valido');
        }
      })
      .catch((error) => {
        console.error('Error al verificar el token de Google:', error);
      });
  }
  </script>
  
  <style>
  .btn_google {
    display: flex;
    justify-content: center;
    margin-top: 50px;
  }
  </style>
  

