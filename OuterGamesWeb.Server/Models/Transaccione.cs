using System;
using System.Collections.Generic;

namespace OuterGamesWeb.Server.Models;

public partial class Transaccione
{
    public int Idtransaccion { get; set; }

    public int? Idpedido { get; set; }

    public DateTime? FechaTransaccion { get; set; }

    public decimal? MontoTransaccion { get; set; }

    public string? EstadoTransaccion { get; set; }

    public virtual Pedido? IdpedidoNavigation { get; set; }
}
