using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using OuterGamesWeb.Server.Models;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace OuterGamesWeb.Server.Controllers
{
    [ApiController]
    [Route("[Controller]")]
    public class AuthController : Controller
    {
        private readonly OuterGamesContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(OuterGamesContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Usuario user)
        {
            try
            {
                if (_context.Usuarios.Any(u => u.CorreoElectronico == user.CorreoElectronico))
                {
                    return BadRequest(new { message = "El correo electrónico ya está en uso." });
                }

                var lastUser = _context.Usuarios.OrderByDescending(u => u.Idusuario).FirstOrDefault();
                user.Idusuario = (lastUser == null) ? 1 : lastUser.Idusuario + 1;
                user.Contrasena = BCrypt.Net.BCrypt.HashPassword(user.Contrasena);
                _context.Usuarios.Add(user);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Usuario registrado exitosamente.", user });

            } catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }


        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel login)
        {
            var user = _context.Usuarios.SingleOrDefault(u => u.CorreoElectronico == login.CorreoElectronico);
            if (user == null || string.IsNullOrEmpty(user.CorreoElectronico) || !BCrypt.Net.BCrypt.Verify(login.Contrasena, user.Contrasena))
            {
                return Unauthorized(new { message = "Correo o contraseña incorrectos." });
            }

            login.IdUsuario = user.Idusuario;

            var jwtKey = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(jwtKey) || jwtKey.Length < 16)
            {
                return StatusCode(500, new { message = "Error de configuración del servidor. La clave JWT es demasiado corta.", jwtKey });
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(jwtKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
            new Claim(ClaimTypes.Name, user.Idusuario.ToString()),
            new Claim(ClaimTypes.Email, user.CorreoElectronico ?? string.Empty) // Asegurar que no sea null
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return Ok(new { token = tokenHandler.WriteToken(token), login});
        }


        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordModel model)
        {
            var user = await _context.Usuarios.SingleOrDefaultAsync(u => u.CorreoElectronico == model.CorreoElectronico);
            if (user == null)
            {
                return Ok(new { message = "Se ha enviado un correo para recuperar la contraseña." });
            }

            //Generar token
            
            // Simulando una operación asincrónica (por ejemplo, envío de correo)
            await Task.Run(() =>
            {
                // Aquí iría la lógica para generar un token de restablecimiento y enviar el correo
            });

            return Ok(new { message = "Se ha enviado un correo para recuperar la contraseña." });
        }
    }
}
