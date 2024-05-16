using System;
using System.Collections.Generic;

namespace OuterGamesWeb.Server.Models;

public partial class Pedido
{
    public int Idpedido { get; set; }

    public int? Idusuario { get; set; }

    public DateTime? FechaPedido { get; set; }

    public string? EstadoPedido { get; set; }

    public virtual ICollection<DetallesPedido> DetallesPedidos { get; set; } = new List<DetallesPedido>();

    public virtual Usuario? IdusuarioNavigation { get; set; }

    public virtual ICollection<Transaccione> Transacciones { get; set; } = new List<Transaccione>();
}
