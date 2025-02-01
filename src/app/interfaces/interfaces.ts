export interface Componente {
    icon: string;
    name: string;
    redirectTo: string;
    disabled: boolean;
}

  export interface CONTACT{
    id?:string;
    estado?:string;
    email?:string;
    createdAt ?: string;
    name?:string;
    foto?:string;
    whatsapp?: string;
    updatedAt?:string;
  }

  export interface BILL{
    id?:string;
    estado?:string;
    numero?:number;
    qr?:string;
    titulo?:string;
    user?:string;
    frase?:string
    createdAt?: string;
    updatedAt?: string;
  }
  export interface USERT{
    id?: string;
    email?: string;
    empresa?: string;
    createdAt?: string;
    updatedAt?: string;
    celular?: string;
    name?: string;
    cabeza?: string;
    urlSocket?: string;
    lastname?: string;
    username?: string;
    password?: string;
    rol?: any;
    percentage?: number;
    check?: boolean;
    idUserAdviser?: string;
    idAviserAsigned?: string;
    qrWhatsapp?: string;
    urlGoogleExel?: string;
  }

  export interface ROL{
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    descripcion?: string;
    estado?: string;
    nombre?: string;
  }

  export interface WHATSAPP{
    id?: string;
    to?: string;
    txt?: string;
    foto?: string;
    createdAt?: string;
    from?: string;
    updatedAt?: string;
    contactId?: any;
    check?: boolean;
    whatsappIdList?: any;
    sendAnswered?: number;
    seen?: number;
    To?: string;
    date?: any;
    date1?: string;
    checkT?: boolean;
  }
  export interface WHATSAPPDETAILS{
    id?: string;
    user?:string;
    txt?: string;
    quien?: number;
    to?: string;
    from?: string;
    urlMedios?: string;
    createdAt?: string;
    updatedAt?: string;
    viewFile?: string;
    typeTxt?: string;
    seen?: number;
    relationMessage?: string;
    estado?: number;
    numberGuide?: string;
    idWhatsapp?: string;
    dataRelationMessage?: any;
    tipeGuide?:string;
    contactIdList?: any;
    date?: string;
  }

  export interface MSG{
    txt?:string;
    quien?: number;
    user?:string;
    msx?:any;
    contactId?:any;
    dataFront?:any;
    dataDbs?:any;
    ids?:string;
  }

  export interface BLOCK {
    id?: string;
    x: number;
    y: number;
    width: number;
    height: number;
    content: string;
    createdAt?: string;
    updatedAt?: string;
  }

  export interface INDICATOR {
    txt?: string;
  }

  export interface FLOWS {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    idInfoWhatsapp?: string;
    views?:string;
    text?: string;
    indicador?: string;
    listLogic?: any;
  }
  export interface TAG {
    id?: string;
    user?: string;
    tag?: string;
    createdAt?: string;
    updatedAt?: string;
  }
  export interface LOGICWHATSAPP {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
  };
export interface BROADCAST{
  id?: string;
  user?: string;
  titulo?: string;
  numero?: number;
  checkSmartDelay?: string;
  checkProgram?: boolean;
  timeMessage?: string;
  idFlow?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WHATSAPPINFO {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
};


export interface WHATSAPPINFOUSER {
  id?: string;
  userId?:string;
  user?: USERT;
  whatsappId?:string;
  whatsapp?: WHATSAPPINFO;
  estado?:number;
  assignedMe?:number;
  tagId?:string;
  tag?: TAG;
  sequenceId?: string;
  sequence?: INFOWHATSAPP;
  createdAt?: string;
  updatedAt?: string;
  companyId?: string;

}

export interface INFOWHATSAPP {
 id?: string;
 createdAt?: string;
  updatedAt?: string;
}

export interface CONTACTDIALOG{
  contactId?:CONTACT;
  id?: string;
  ids?: string;
  createdAt?: string;
  updatedAt?: string;
  to?: string;
  from?: string;
  user?: string;
}

export interface TAGUSER{
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  tag?: string;
  tagList?: TAG;
  user?: string;
  userList?: USERT;
  estado?: number;
  contact: string;
  contactList?: CONTACT;
}

export interface SEQUENCES{
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  sequence?: string;
  state?: string;
  user?: string;
  userList?: USERT;
  contact: string;
  contactList?: CONTACT;
}


export interface SEQUENCESUSER{
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  sequence?: string;
  whatsappTxt?: string;
  companyId?: string;
  state?: string;
}

export interface CAMPAIGNS{
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  campaigns?: string;
  state?: string;
  user?: string;
  userList?: USERT;
  contact: string;
  contactList?: CONTACT;
}

export interface WHATSAPPTXT{
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  check?: boolean;
}

export interface WHATSAPPTXTUSER{
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  userIdList?: USERT;
  whatsappId: string;
  whatsappIdList?: WHATSAPPTXT;
  estado?: number;
  assignedMe?: number;
  tagId?: TAG;
  sequenceId?: string;
  sequenceIdList?:SEQUENCES;
}

export interface FASTANSWER{
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  check?: boolean;
  title?: string;
  description?: string;
  companyId?: string;
  companyIdList?: USERT;
  userCreationId?: string;
  userCreationIdList?: USERT;
  descripcion?: string;
}
export interface GALERIA{
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GALERIA{
  id?: string;
  createdAt?: string;
  updatedAt?: string;

}

export interface Fruit {
  id?: any;
  nombre?: string;
  usu_email: string;
}

export interface googleSheet {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: string;
  company?: string;
  state?: number;
  urlGoogle?: string;
  key1?: string;
  key2?: string;
  title?: string;
  description?: string;
}

export interface CONFIGTEXT {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  titulo?: string;
  description?: string;
  typeOpt?: string;
  user?: string;
  company?: string;
}