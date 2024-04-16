import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigKeysService {
  _config = {
    keys:{
      audience: "Audiencia",
      bell: "Campañas",
      broadcast: 'transmisión',
      liveChat: "Chat en Vivo",
      flows: "Flujo de conversación",
      config: 'ConFiguraciones',
      createContact: 'Crear Contacto',
      dischargeInfo: 'Descargar Informe',
      importContact: 'Importar Contactos',
      mostPopular: 'Mas Populares',
      mostPopularDes: "(Utilice el botón 'Agregar filtro' para filtrar etiquetas menos populares)",
      tag: 'Etiquetas',
      sequences: 'Sequencias',
      campaigns: 'Campañas',
      addFilter: 'Agregar Filtro',
      search: 'Buscar ...',
      txtTemporarilyFilter: "Temporalmente, solo podrás aplicar 2 filtros.",
      btnReset: "Restablecer",
      txtUserFilter: 'Mostrar el total de usuarios filtrados',
      variables: "Campos personalizados",
      txtChat: "El Chat",
      closed: "Cerrado",
      opened: "Abierto",
      btnMarkClosed: "Marcar como terminado",
      btnReopen: "Reabrir",
      txtUpdate: "Actualizado",
      txtCreate: "Creado",
      txtError: "Error",
      phone: "Teléfono",
      email: "email",
      subscribed: "Fecha de inscripción",
      cpf: "CPF",
      txtGotoChat: "Ir al chat",
      txtAutomationUser: "La automatización está desactivada para el usuario",
      txtPauseAutomation: "Iniciará",
      unassignMe: "Desasignarme",
      assignedTo: "Asignado a:",
      btnCreateCampaign: "Create nueva Camapaña",
      txtUpdateBill: "Editar Campaña",
      txtCreateBill: "Crear Camapaña",
      txtFormName: "Nombre",
      txtFormNumber: "Numero",
      txtFormWhatPhrase: "¿Qué frase debe iniciar esta campaña?",
      btnAddC: "Guardar cambios",
      txtPleaseDon: "Por favor, no termines esta frase con un punto (.), signo de exclamación (!) o signo de interrogación (?)",
      mine: "mis chats",
      unassigned: "Todos ocupados"
    }
  };
  constructor() { }
}
