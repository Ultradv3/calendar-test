// plugins/vuetify.js

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";
import { VCalendar } from "vuetify/labs/VCalendar";
import es from "vuetify/lib/locale/es"; // Importar las traducciones de Vuetify
import { createI18n } from "vue-i18n";

// Configuración de Vue I18n
const i18n = createI18n({
  locale: "es", // Idioma predeterminado
  messages: {
    es: { $vuetify: es }, // Usar las traducciones de Vuetify para el idioma español
  },
});

// Crear Vuetify con la configuración de i18n
export default createVuetify({
  locale: {
    locale: "es", // Configurar Vuetify para usar español por defecto
    messages: {
      es, // Pasar las traducciones a Vuetify
    },
  },
  theme: {
    defaultTheme: "light",
  },
  components: {
    VCalendar, // Asegúrate de que VCalendar esté habilitado
  },
  i18n, // Integrar la instancia de i18n
});
