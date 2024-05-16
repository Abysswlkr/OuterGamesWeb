using System;
using System.Collections.Generic;

namespace OuterGamesWeb.Server.Models;

public partial class DetallesPedido
{
    public int IddetallePedido { get; set; }

    public int? Idpedido { get; set; }

    public int? Idvideojuego { get; set; }

    public int? Cantidad { get; set; }

    public decimal? PrecioCompra { get; set; }

    public virtual Pedido? IdpedidoNavigation { get; set; }

    public virtual Videojuego? IdvideojuegoNavigation { get; set; }
}
