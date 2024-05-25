using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OuterGamesWeb.Server.Models;

namespace OuterGamesWeb.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsuariosController : Controller
    {
        private readonly OuterGamesContext _context;
        private readonly ILogger<UsuariosController> _logger;

        //Constructor
        public UsuariosController(OuterGamesContext context, ILogger<UsuariosController> logger)
        {
            _context = context;
            _logger = logger;
        }

        //GET: UsuariosController
        [HttpGet("GetUsuarios")]
        public async Task<ActionResult> AllUsers()
        {
            var usuarios = await _context.Usuarios.ToListAsync();
            if (!usuarios.Any())
            {
                return NotFound("Usuarios no disponibles");
            }
            return Ok(usuarios);
        }

        //GET: UsuariosController/GetUserById/number
        [HttpGet("GetUserById/{id}")]
        public async Task<ActionResult> UserById(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
            {
                return NotFound("No se encontró el usuario con la id especificada.");
            }
            return Ok(usuario);
        }

        //POST: UsuariosController/Create
        [HttpPost("Create")]
        public ActionResult CreateUser(Usuario usuario)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var lastUser = _context.Usuarios.OrderByDescending(u => u.Idusuario).FirstOrDefault();

                    if (!string.IsNullOrEmpty(usuario.Contrasena))
                    {
                        usuario.Idusuario = (lastUser == null) ? 1 : lastUser.Idusuario + 1;
                        // Hashear la contraseña usando BCrypt
                        usuario.Contrasena = BCrypt.Net.BCrypt.HashPassword(usuario.Contrasena);
                        _context.Usuarios.Add(usuario);
                        _context.SaveChanges();
                        return Ok(usuario);
                    }
                    else
                    {
                        return BadRequest("Contraseña no ingresada correctamente");
                    }
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }



        // PUT: UsuariosController/EditUser
        [HttpPost("EditUser/{id}")]
        public async Task<ActionResult> EditUser(int id, Usuario usuario)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                usuario.Contrasena = BCrypt.Net.BCrypt.HashPassword(usuario.Contrasena);
                _context.Update(usuario);
                await _context.SaveChangesAsync();
                return Ok(usuario);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("EditUser/{id}/UpdateEmail")]
        public ActionResult UpdateEmail(int id, [FromBody] string correoElectronico)
        {
            try
            {
                var usuario = _context.Usuarios.Find(id);
                if (usuario == null)
                {
                    return NotFound("Usuario no encontrado");
                }

                usuario.CorreoElectronico = correoElectronico;
                _context.Update(usuario);
                _context.SaveChanges();
                return Ok(usuario);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("EditUser/{id}/UpdateAddress")]
        public ActionResult UpdateAddress(int id, [FromBody] string direccionEnvio)
        {
            try
            {
                var usuario = _context.Usuarios.Find(id);
                if (usuario == null)
                {
                    return NotFound("Usuario no encontrado");
                }

                usuario.DireccionEnvio = direccionEnvio;
                _context.Update(usuario);
                _context.SaveChanges();
                return Ok(usuario);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("EditUser/{id}/UpdatePassword")]
        public ActionResult UpdatePassword(int id, [FromBody] string contrasena)
        {
            try
            {
                var usuario = _context.Usuarios.Find(id);
                if (usuario == null)
                {
                    return NotFound("Usuario no encontrado");
                }

                usuario.Contrasena = BCrypt.Net.BCrypt.HashPassword(contrasena);
                _context.Update(usuario);
                _context.SaveChanges();
                return Ok(usuario);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpDelete("DeleteUser/{id}")]
        public ActionResult DeleteUser(int id)
        {
            try
            {
                var findUsuario = _context.Usuarios.Find(id);
                if (findUsuario != null)
                {
                    _context.Usuarios.Remove(findUsuario);
                    _context.SaveChanges();
                    return Ok("El usuario se ha eliminado correctamente.");
                } else
                {
                    return NotFound("El usuario no se ha encontrado.");
                }

            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


    }
}
