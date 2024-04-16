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
  }
  export interface Whatsapp{
    id?: string;
  }
  export interface WhatsappDetails{
    id?: string;
    user?:string;
    txt?: string;
    quien?: number;
    to?: string;
    from?: string;
  }

  export interface Msg{
    txt?:string;
    quien?: number;
    user?:string;
  }
