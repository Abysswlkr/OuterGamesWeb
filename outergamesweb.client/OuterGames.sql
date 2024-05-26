CREATE TABLE Usuarios (
    IDUsuario INT PRIMARY KEY,
    Nombre NVARCHAR(100),
    CorreoElectronico NVARCHAR(100),
    Contrasena NVARCHAR(100),
    DireccionEnvio NVARCHAR(255)
);

CREATE TABLE Videojuegos (
    IDVideojuego INT PRIMARY KEY,
    NombreVideojuego NVARCHAR(100),
    Descripcion NVARCHAR(255),
    Precio DECIMAL(10, 2),
    CantidadStock INT,
    Plataforma NVARCHAR(50),
    Genero1 NVARCHAR(50),
    Genero2 NVARCHAR(50) NULL,
    Genero3 NVARCHAR(50) NULL,
    Imagen NVARCHAR(255) NULL
);

CREATE TABLE Pedidos (
    IDPedido INT PRIMARY KEY,
    IDUsuario INT FOREIGN KEY REFERENCES Usuarios(IDUsuario),
    FechaPedido DATETIME,
    EstadoPedido NVARCHAR(50)
);

CREATE TABLE DetallesPedido (
    IDDetallePedido INT PRIMARY KEY,
    IDPedido INT FOREIGN KEY REFERENCES Pedidos(IDPedido),
    IDVideojuego INT FOREIGN KEY REFERENCES Videojuegos(IDVideojuego),
    Cantidad INT,
    PrecioCompra DECIMAL(10, 2)
);

CREATE TABLE Transacciones (
    IDTransaccion INT PRIMARY KEY,
    IDPedido INT FOREIGN KEY REFERENCES Pedidos(IDPedido),
    FechaTransaccion DATETIME,
    MontoTransaccion DECIMAL(10, 2),
    EstadoTransaccion NVARCHAR(50)
);


-- Insertar datos en la tabla Usuarios
INSERT INTO Usuarios (IDUsuario, Nombre, CorreoElectronico, Contrasena, DireccionEnvio)
VALUES (1, 'Juan Perez', 'juan.perez@example.com', 'contraseña_segura', 'Calle Falsa 123, Santiago');

-- Insertar datos en la tabla Videojuegos
INSERT INTO Videojuegos (IDVideojuego, NombreVideojuego, Descripcion, Precio, CantidadStock, Plataforma, Genero1, Genero2, Genero3, Imagen)
VALUES (1, 'Super Mario Bros.', 'Un clásico juego de plataformas.', 59.99, 100, 'Nintendo Switch', 'Plataformas', NULL, NULL, NULL);

-- Insertar datos en la tabla Pedidos
INSERT INTO Pedidos (IDPedido, IDUsuario, FechaPedido, EstadoPedido)
VALUES (1, 1, GETDATE(), 'Pendiente');

-- Insertar datos en la tabla DetallesPedido
INSERT INTO DetallesPedido (IDDetallePedido, IDPedido, IDVideojuego, Cantidad, PrecioCompra)
VALUES (1, 1, 1, 1, 59.99);

-- Insertar datos en la tabla Transacciones
INSERT INTO Transacciones (IDTransaccion, IDPedido, FechaTransaccion, MontoTransaccion, EstadoTransaccion)
VALUES (1, 1, GETDATE(), 59.99, 'Exitosa');