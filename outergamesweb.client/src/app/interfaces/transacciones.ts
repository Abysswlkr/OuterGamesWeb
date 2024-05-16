export interface Transaccion {
    idtransaccion: number;
    idpedido: number;
    fechaTransaccion: Date;
    montoTransaccion: number;
    estadoTransaccion: string;
}