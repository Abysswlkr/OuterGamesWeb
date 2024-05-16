using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace OuterGamesWeb.Server.Models;

public partial class OuterGamesContext : DbContext
{
    public OuterGamesContext(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public OuterGamesContext(DbContextOptions<OuterGamesContext> options, IConfiguration configuration)
        : base(options)
    {
        _configuration = configuration;
    }

    public virtual DbSet<DetallesPedido> DetallesPedidos { get; set; }

    public virtual DbSet<Pedido> Pedidos { get; set; }

    public virtual DbSet<Transaccione> Transacciones { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }

    public virtual DbSet<Videojuego> Videojuegos { get; set; }

    public readonly IConfiguration _configuration;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer(_configuration.GetConnectionString("Connection"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<DetallesPedido>(entity =>
        {
            entity.HasKey(e => e.IddetallePedido).HasName("PK__Detalles__8F055244C85D4AF0");

            entity.ToTable("DetallesPedido");

            entity.Property(e => e.IddetallePedido)
                .ValueGeneratedNever()
                .HasColumnName("IDDetallePedido");
            entity.Property(e => e.Idpedido).HasColumnName("IDPedido");
            entity.Property(e => e.Idvideojuego).HasColumnName("IDVideojuego");
            entity.Property(e => e.PrecioCompra).HasColumnType("decimal(10, 2)");

            entity.HasOne(d => d.IdpedidoNavigation).WithMany(p => p.DetallesPedidos)
                .HasForeignKey(d => d.Idpedido)
                .HasConstraintName("FK__DetallesP__IDPed__3E52440B");

            entity.HasOne(d => d.IdvideojuegoNavigation).WithMany(p => p.DetallesPedidos)
                .HasForeignKey(d => d.Idvideojuego)
                .HasConstraintName("FK__DetallesP__IDVid__3F466844");
        });

        modelBuilder.Entity<Pedido>(entity =>
        {
            entity.HasKey(e => e.Idpedido).HasName("PK__Pedidos__00C11F9914CB72C3");

            entity.Property(e => e.Idpedido)
                .ValueGeneratedNever()
                .HasColumnName("IDPedido");
            entity.Property(e => e.EstadoPedido).HasMaxLength(50);
            entity.Property(e => e.FechaPedido).HasColumnType("datetime");
            entity.Property(e => e.Idusuario).HasColumnName("IDUsuario");

            entity.HasOne(d => d.IdusuarioNavigation).WithMany(p => p.Pedidos)
                .HasForeignKey(d => d.Idusuario)
                .HasConstraintName("FK__Pedidos__IDUsuar__3B75D760");
        });

        modelBuilder.Entity<Transaccione>(entity =>
        {
            entity.HasKey(e => e.Idtransaccion).HasName("PK__Transacc__2DABE47E047386CE");

            entity.Property(e => e.Idtransaccion)
                .ValueGeneratedNever()
                .HasColumnName("IDTransaccion");
            entity.Property(e => e.EstadoTransaccion).HasMaxLength(50);
            entity.Property(e => e.FechaTransaccion).HasColumnType("datetime");
            entity.Property(e => e.Idpedido).HasColumnName("IDPedido");
            entity.Property(e => e.MontoTransaccion).HasColumnType("decimal(10, 2)");

            entity.HasOne(d => d.IdpedidoNavigation).WithMany(p => p.Transacciones)
                .HasForeignKey(d => d.Idpedido)
                .HasConstraintName("FK__Transacci__IDPed__4222D4EF");
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.Idusuario).HasName("PK__Usuarios__52311169C1344643");

            entity.Property(e => e.Idusuario)
                .ValueGeneratedNever()
                .HasColumnName("IDUsuario");
            entity.Property(e => e.Contrasena).HasMaxLength(100);
            entity.Property(e => e.CorreoElectronico).HasMaxLength(100);
            entity.Property(e => e.DireccionEnvio).HasMaxLength(255);
            entity.Property(e => e.Nombre).HasMaxLength(100);
        });

        modelBuilder.Entity<Videojuego>(entity =>
        {
            entity.HasKey(e => e.Idvideojuego).HasName("PK__Videojue__F5041CEB952EEFD9");

            entity.Property(e => e.Idvideojuego)
                .ValueGeneratedNever()
                .HasColumnName("IDVideojuego");
            entity.Property(e => e.Descripcion).HasMaxLength(255);
            entity.Property(e => e.Genero1).HasMaxLength(50);
            entity.Property(e => e.Genero2).HasMaxLength(50);
            entity.Property(e => e.Genero3).HasMaxLength(50);
            entity.Property(e => e.Imagen).HasMaxLength(255);
            entity.Property(e => e.NombreVideojuego).HasMaxLength(100);
            entity.Property(e => e.Plataforma).HasMaxLength(50);
            entity.Property(e => e.Precio).HasColumnType("decimal(10, 2)");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
