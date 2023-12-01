<template>

  <v-text-field v-model="search" label="Buscar persona por ID" @input="filtrarID"></v-text-field>


  <v-data-table
    :headers="headers"
    :items="personas"
    :sort-by="[{ key: 'personas', order: 'asc' }]"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Tabla Personas</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="props"
            >
              Nuevo registro
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.rfc"
                      label="RFC"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.nombre"
                      label="Nombre"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.email"
                      label="email"
                    ></v-text-field>
                  </v-col>
      
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="close"
              >  <!-- Esta ventana la comparte el metodo de crear y editar (save) -->
                Cancelar
              </v-btn>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="save"
              >
                Confirmar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">¿Estas seguro de borrar el registro?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancelar</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">Confirmar</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        size="small"
        class="me-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        size="small"
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="mostrar"
      >
        Reiniciar
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>

import tokenService from './tokenService';


export default {
data: () => ({

  
  search: '',
  personas: [],
  dialog: false,
  dialogDelete: false,
  headers: [
    {
      title: 'ID',
      align: 'start',
      sortable: true,
      key: 'id',
    },

    { title: 'RFC', key: 'rfc' },
    { title: 'Nombre', key: 'nombre' },
    { title: 'Email', key: 'email' },
    { title: 'Acciones', key: 'actions', sortable: false },
  ],
  

  editedIndex: -1,
  editedItem: {
    id: null,
    rfc: '',
    nombre: '',
    email: '',
  },
  defaultItem: {
    id: null,
    rfc: '',
    nombre: '',
    email: '',
  },
}),

computed: {
  formTitle () {
    return this.editedIndex === -1 ? 'Nuevo Registro' : 'Editar Registro'
  },
},

watch: {
  dialog (val) {
    val || this.close()
  },
  dialogDelete (val) {
    val || this.closeDelete()
  },
},

async created () {
 
  await this.mostrar()
},

methods: {
  
  /*
  initialize () {
    this.personas = [
      {
        id: 1,
        rfc: "AFDN360203JU1",
        name: "Juan",
        email: " juan1996@gmail.com",
      },
      {
        id: 2,
        rfc: "XULT350511WD8",
        name: 'Pedro',
        email:"pedro2000@gmail.com" ,
       
      },
    
    ]
  },
  */

  // autenticacion.
  async axiosRequest(url, method, data = null) {
      try {
    
        const tokenI = await tokenService.getToken();
        localStorage.setItem('token', tokenI);
        const token = localStorage.getItem('token');

        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        };

        let response;

        switch (method) {
          case 'get':
            response = await this.$axios.get(url, config);
            break;
          case 'post':
            response = await this.$axios.post(url, data, config);
            break;
          case 'put':
            response = await this.$axios.put(url, data, config);
            break;
          case 'delete':
            response = await this.$axios.delete(url, config);
            break;
          default:
            throw new Error(`Metodo no disponible: ${method}`);
        }

        return response.data;
      } catch (error) {
        console.error(`Error en la solicitud ${method.toUpperCase()} a ${url}:`, error);
        throw error;
      }
  },  
  
  async filtrarID() {
    if (this.search) {
        const searchId = parseInt(this.search);
        try {
          const response = await this.axiosRequest(`https://localhost:3001/persona/${searchId}`, 'get');
          this.personas = response ? [response] : [];
        } catch (error) {
          // Manejar el error si es necesario.
        }
      } else {
        this.mostrar(); // Restaurar la lista completa cuando no hay busqueda.
    }
  }, 
  
  async mostrar() {
      try {
        const response = await this.axiosRequest('https://localhost:3001/persona/', 'get');
        this.personas = response;
      } catch (error) {
        // Manejar el error si es necesario.
      }
  },

  editItem (item) { //Edita el registro
      this.editedIndex = this.personas.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.personas.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm () {
      const itemId = this.editedItem.id;
      try {
        await this.axiosRequest(`https://localhost:3001/persona/${itemId}`, 'delete');
        console.log('Elemento borrado con exito en el backend');
        this.personas.splice(this.editedIndex, 1);
        this.closeDelete();
      } catch (error) {
        // Manejar el error si es necesario.
      }
    },

    close () { //Este cierra la ventana cuando se confirma la accion en crear/editar.
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () { //Este cierra la ventana cuando se confirma la accion de borrar.
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    async save () { //Crea y edita registros.
      try {
        if (this.editedIndex > -1) {
          // Editar registro existente
          const response = await this.axiosRequest(`https://localhost:3001/persona/${this.editedItem.id}`, 'put', this.editedItem);
          console.log('Elemento editado con exito');
          this.personas[this.editedIndex] = response;
        } else {
          // Insertar nuevo registro
          const response = await this.axiosRequest('https://localhost:3001/persona/', 'post', this.editedItem);
          console.log('Elemento creado con exito');
          this.personas.push(response);
        }
        this.close();
      } catch (error) {
        // Manejar el error si es necesario.
      }

    },

},
}
</script>