using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace OuterGamesWeb.Server.Models;

public partial class Usuario
{
    [Required]
    public int Idusuario { get; set; }

    [Required]
    [StringLength(30)]
    public string? Nombre { get; set; }

    [Required]
    [StringLength(40)]
    public string? CorreoElectronico { get; set; }

    [Required]
    [StringLength(50)]
    public string? Contrasena { get; set; }

    [Required]
    [StringLength(30)]
    public string? DireccionEnvio { get; set; }

    public virtual ICollection<Pedido> Pedidos { get; set; } = new List<Pedido>();
}
