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
      whatsapp: "Whatsapp",
      createContact: 'Crear Contacto',
      txtCreateWhatsapp: "Crear Whatsapp",
      txtUpdateWhatsapp: "Actualizar Whatsapp",
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
      email: "Email",
      subscribed: "Fecha de inscripción",
      cpf: "CPF",
      txtGotoChat: "Ir al chat",
      txtAutomationUser: "La automatización está desactivada para el usuario",
      txtPauseAutomation: "Iniciará",
      unassignMe: "Desasignarme",
      assignedMe: "Asignarme",
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
      unassigned: "Todos ocupados",
      initialDetails: "Detalle Inicial",
      description: "Descripcion",
      btnSaved: "Guardar",
      whatsappLogic: "Logica de Whatsapp",
      BtnClearList: "Limpiar lista",
      BtnAddFurther: "Agregar Mas",
      BtnDouble: "Duplicar",
      btnDelete: "Borrar",
      indicatorNumber: "Numero / indicador:",
      indicatorDeep: "Indicador Profundo",
      urlMedia: "urlMedios",
      answer: "Respuesta",
      broadcasts: "Transmisión",
      addNewBroadcast: "Crear nueva transmisión",
      activeScheduled: "Activas y programadas",
      drafts: "Borradores",
      history: "Historial",
      txtCreateBroadcast: "Crear transmisión",
      txtUpdateBroadcast: "Actualizar transmisión",
      txtBroadcastConfig: "Configuraciones de transmisión",
      txtFlow: "Flujo",
      delay: "Retraso",
      smartDelay: "Retraso Inteligente",
      manuallyDelay: "Retraso manual",
      seconds: "Segundos",
      txtDelay: "Configura el retraso de tiempo con el que funcionará tu transmisión. Cuanto mayor sea el retraso, menos probable es que tu transmisión se confunda con spam, pero las transmisiones grandes pueden durar mucho tiempo",
      veryShort: "Muy corto 1-5s",
      short: "Corto 5-20s",
      medium: "Medio 20-50s",
      long: "Largo 50-120s",
      veryLong: "Muy largo 120-300s",
      setTimeLater: "Establecer hora y ejecutar más tarde",
      targeting: "Segmentación",
      txtUserBroadcast: "Usuarios que recibirán esta transmisión:",
      btnShowUsers: "Mostrar usuarios",
      addFilterAudience: "Agregar filtros para refinar su audiencia",
      btnStartNow: "Iniciar Ahora"      ,
      btnStartSchedule: "Iniciar Programación",
      universalMessages: "Mensajes Universales",
      txtFile: "Archivos",
      btnTxtFile: "Subir Archivos",
      txtSend: "Enviar",
      txtSelect: "Seleccionar",
      txtDeSelect: "Deseleccionar",
      fastAnswer: "Respuesta rapida",
      teamMembers: "Miembros del equipo",
      officeHours: "Horario de oficina",
      defaultFlows: "Flujos predeterminados",
      check: "Check",
      name: "Nombre",
      descripcion: "Descripcion",
      btnCreateNewResponse: "Create Nueva Respuesta",
      btnDrop: "Eliminar",
      lastname: "Apellido",
      username: "Usuario de plataforma",
      cel: "Celular",
      password: "Contraseña",
      txtUpdateBtn: "Actualizar",
      btnClean: "Limpiar",
      txtDetailsDrop: "Deseas Eliminar Dato",
      yesDrop: "Si Eliminar",
      rangeDateTxt: "Rango de Fechas",
      closeChat: "Chat Cerrado",
      txtDetailsFinChat: "Deseas Finalizar el chat",
      newMessage: "Mensajes Sin Contestar",
      viewMessage: "Mensajes Contestados",
      numberGuider: "Numero de Guia",
      submitFile: "Subir Archivos",
      listArchive: "Lista de Archivos",
      galleryTxt: "Galeria Detalle",
      roleName: "Rol",
      btnAdviser: "Agregarle asesores",
      txtPercentage: "Porcentaje",
      txtListAdviser: "Lista de Asesores",
      txtTypeAction: "Tipo de Acción",
      txtButtonShift: "nombre de los botones",
      listButtonShift: "Lista de Botones",
      txtNextSequence: "Secuencia siguiente",
      listNextSequence: "Lista de Secuencia",
      txtTimeMessage: "Tiempo entre mensaje next ejemplo  5 | 10 | 20 | 30 | 50",
      txtButtonCrearFlows: "Crear Flujo",
      txtIndicatorButton: "Indicador del boton",
      txtReload: "Refrescar",
      txtCrearFile: "Crear archivo"
    }
  };
  constructor() { }
}
