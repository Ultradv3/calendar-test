<template>
  <div>
    <!-- Selección de vista y semana -->
    <v-sheet class="d-flex mb-5" height="54" tile>
      <v-select v-model="type" :items="types" class="ma-2" label="Vistas" variant="outlined" dense
        hide-details></v-select>
      <v-select v-model="weekday" :items="weekdays" class="ma-2" label="Semanas" variant="outlined" dense
        hide-details></v-select>
    </v-sheet>

    <!-- Calendario -->
    <v-sheet>
      <v-calendar hide-header="true" :locale="es" ref="calendar" v-model="value" :events="events" :view-mode="type"
        :weekdays="weekday">
        <template v-slot:event="props">
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-chip v-bind="attrs" v-on="on" :color="props.event.color" class="text-capitalize" outlined small>
                <strong>{{ props.event.title }}</strong>
                <br />
                <span><em>Usuario:</em> {{ props.event.user }}</span>
                <br />
                <span><em>De:</em> {{ formatDate(props.event.start) }} <em>a</em> {{ formatDate(props.event.end)
                  }}</span>
                <br />
                <div v-if="props.event.description">
                  <em>Descripción:</em> {{ props.event.description }}
                </div>
              </v-chip>
            </template>
          </v-tooltip>
        </template>
      </v-calendar>
    </v-sheet>

    <!-- Formulario para agregar evento manualmente -->
    <v-dialog v-model="showDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Agregar Evento</span>
        </v-card-title>
        <v-card-text>
          <v-form v-model="formValid">
            <v-text-field v-model="newEvent.title" label="Título" :rules="[v => !!v || 'Este campo es obligatorio']"
              required></v-text-field>
            <v-text-field v-model="newEvent.user" label="Usuario" :rules="[v => !!v || 'Este campo es obligatorio']"
              required></v-text-field>
            <v-textarea v-model="newEvent.description" label="Descripción" rows="4"></v-textarea>
            <v-date-picker v-model="newEvent.start" label="Fecha de inicio"
              :rules="[v => !!v || 'Este campo es obligatorio']" required></v-date-picker>
            <v-date-picker v-model="newEvent.end" label="Fecha de fin"
              :rules="[v => !!v || 'Este campo es obligatorio']" required></v-date-picker>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="showDialog = false">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="addEvent">Agregar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Botón para abrir el diálogo -->
    <v-btn color="primary" @click="showDialog = true">Agregar Evento</v-btn>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
import axios from 'axios';

// Estado reactivo para manejar la vista, la semana y los eventos
const type = ref('day');
const types = ref(['month', 'week', 'day']);
const weekday = reactive([0, 1, 2, 3, 4, 5, 6]);
const weekdays = reactive([
  { title: 'Dom - Sáb', value: [0, 1, 2, 3, 4, 5, 6] },
  { title: 'Lun - Dom', value: [1, 2, 3, 4, 5, 6, 0] },
  { title: 'Lun - Vie', value: [1, 2, 3, 4, 5] },
  { title: 'Lun, Mié, Vie', value: [1, 3, 5] },
]);

// Estado para almacenar los eventos, fecha seleccionada y la validez del formulario
const value = ref([new Date()]);
const events = ref([]);
const formValid = ref(false);
const showDialog = ref(false); // Controla si el diálogo está abierto o cerrado

// Datos del nuevo evento
const newEvent = reactive({
  title: '',
  user: '',
  description: '',
  start: null,
  end: null,
  color: 'blue', // Por ejemplo, puedes asignar un color fijo o aleatorio
});

// Función para formatear las fechas de los eventos
const formatDate = (date) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
  return new Intl.DateTimeFormat('es-ES', options).format(date);
};

// Función para obtener los eventos desde la API
const getEvents = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:3000/api/reservas');
    //console.log(response.data);
    // Aseguramos que la respuesta tenga el formato adecuado

    events.value = response.data.result.map(event => ({
      title: event.nombre_usuario,
      user: event.nombre_usuario,
      description: event.motivo,
      start: new Date(event.fecha_inicio), // Convertir a Date si es necesario
      end: new Date(event.fecha_fin),
      color: event.color || 'blue', // Color por defecto si no se especifica
    }));

  } catch (error) {
    console.error('Error al obtener los eventos:', error);
  }
};

// Función para agregar el evento manualmente
const addEvent = () => {
  if (newEvent.start && newEvent.end && newEvent.title && newEvent.user && newEvent.description) {
    // Agregar el evento a la lista de eventos
    events.value.push({
      title: newEvent.title,
      user: newEvent.user,
      description: newEvent.description,
      start: new Date(newEvent.start), // Convertir el valor de la fecha a un objeto Date
      end: new Date(newEvent.end),
      color: newEvent.color,
    });

    // Limpiar el formulario
    newEvent.title = '';
    newEvent.user = '';
    newEvent.description = '';
    newEvent.start = null;
    newEvent.end = null;
    showDialog.value = false; // Cerrar el diálogo
  }
};


nextTick(() => {
  const calendarEvent = document.querySelector('.v-calendar-internal-event');
  if (calendarEvent) {
    console.log('El div con la clase v-calendar-internal-event existe');
  } else {
    console.log('No se encontró el div con la clase v-calendar-internal-event');
  }
});

// Obtener los eventos al montar el componente
onMounted(() => {
  getEvents();
  nextTick()
});
</script>
