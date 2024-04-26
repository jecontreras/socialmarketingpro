export interface Componente {
    icon: string;
    name: string;
    redirectTo: string;
    disabled: boolean;
}

export interface Fruit {
    color: string;
    id: string;
    estado: boolean;
    foto: string;
    listTallas: any;
  }
  export interface FacturaDto{
    id?:string;
    codigo?: string;
    fecha?:string;
    nombreCliente?:string;
    monto?:number;
    entrada?: number;
    provedor?: string;
    qr?:string;
    descripcion?:string;
    foto?:string;
    estado?: number;
    user?: string;
    tipoFactura?: number;
    asentado?: boolean;
    fechaasentado?: string;
    coinFinix?: boolean;
    check?: boolean;
    amountPass?: number;
    remaining?:number;
    passMoney?:number;
    passMoney2?:number;
  }

  export interface Contact{
    id?:string;
    estado?:string
  }

  export interface Bill{
    id?:string;
    estado?:string;
    numero?:number;
    qr?:string;
    titulo?:string;
    user?:string;
    frase?:string
  }
  export interface UserT{
    id?: string;
    email?: string;
    empresa?: string;
  }
  export interface Whatsapp{
    id?: string;
    to?: string;
    txt?: string;
    foto?: string;
    createdAt?: string;
    from?: string;
  }
  export interface WhatsappDetails{
    id?: string;
    user?:string;
    txt?: string;
    quien?: number;
    to?: string;
    from?: string;
    urlMedios?: string;
  }

  export interface Msg{
    txt?:string;
    quien?: number;
    user?:string;
    msx?:any;
  }

  export interface Block {
    id?: string;
    x: number;
    y: number;
    width: number;
    height: number;
    content: string;
  }

  export interface Indicator {
    txt?: string;
  }

  export interface Flows {
    id?: string;
  }
  export interface Tag {
    id?: string;
    user?: string;
    tag?: string;
  }
  export interface LOGICWHATSAPP {
  };
  export interface Indicador {
    txt?: string;
  }
export interface Broadcast{
  id?: string;
  user?: string;
  titulo?: string;
  numero?: number;
  checkSmartDelay?: string;
  checkProgram?: boolean;
  timeMessage?: string;
  idFlow?: string;
}
