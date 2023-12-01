<template>

    <div class="botones-container">
        <button @click="handleButtonClick('/personas')">Personas</button>
        <button @click="handleButtonClick('/donadores')">Donadores</button>
        <button @click="handleButtonClick('/proyectos')">Proyectos</button>
    </div>

  </template>
  <script setup>
  import { useRouter } from 'vue-router';

  const router = useRouter();


  const handleButtonClick = (ruta) => {
  
    console.log('Navegando a:', ruta);

    router.push(ruta);


  };
  </script>

<style scoped>
/* Centrar Botones y modificar posicion Y */
.botones-container {
  text-align: center;
  margin-top: 20px;
}

/* Subrayado del texto dentro del boton. */
.botones-container button {
  text-decoration: underline;
}

/* Negrita. */
.botones-container button {
  font-weight: bold;;
}

/* Estilo para los botones. */
.botones-container button {
  margin-right: 120px; /* Ajusta la separacion horizontal entre los botones. */
}

/*Tamaño de letra*/
.botones-container button {
  font-size: 24px;
}


</style>