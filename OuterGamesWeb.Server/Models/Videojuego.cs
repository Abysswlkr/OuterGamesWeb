using System;
using System.Collections.Generic;

namespace OuterGamesWeb.Server.Models;

public partial class Videojuego
{
    public int Idvideojuego { get; set; }

    public string? NombreVideojuego { get; set; }

    public string? Descripcion { get; set; }

    public decimal? Precio { get; set; }

    public int? CantidadStock { get; set; }

    public string? Plataforma { get; set; }

    public string? Genero1 { get; set; }

    public string? Genero2 { get; set; }

    public string? Genero3 { get; set; }

    public string? Imagen { get; set; }

    public virtual ICollection<DetallesPedido> DetallesPedidos { get; set; } = new List<DetallesPedido>();
}
