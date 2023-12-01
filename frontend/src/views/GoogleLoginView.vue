<template>
    <div class="inicio">
      <h1 class="titulo">HOME - Gestión Base de Datos</h1>
      <h2 class="login">Iniciar Sesión con Google</h2>
      <BtnGoogleLogin></BtnGoogleLogin>
    </div>
  </template>

  <script setup>

  import BtnGoogleLogin from '@/components/BtnGoogleLogin.vue';
  </script>

<style scoped>
.login {
  text-align: center;
  margin-top: 150px;
}

.titulo{
  text-align: center;
  margin-top: 40px;
}

</style>