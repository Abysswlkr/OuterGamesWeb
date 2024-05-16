using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OuterGamesWeb.Server.Models;

namespace OuterGamesWeb.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class VideogamesController : Controller
    {
        private readonly OuterGamesContext _context;
        private readonly ILogger<VideogamesController> _logger;

        //Constructor
        public VideogamesController(OuterGamesContext context, ILogger<VideogamesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: VideogamesController/GetVideogames
        [HttpGet("GetVideogames")]
        public async Task<ActionResult> AllVideogames()
        {
            try
            {
                var videojuegos = await _context.Videojuegos.ToListAsync();
                if (!videojuegos.Any())
                {
                    return NotFound("Videojugos no disponibles");
                }
                return Ok(videojuegos);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }


        // GET: VideogamesController/GetVideogameById/number
        [HttpGet("GetVideogameById/{id}")]
        public async Task<ActionResult> VideogameDetail(int id)
        {
            try
            {
                var videojuego = await _context.Videojuegos.FindAsync(id);
                if (videojuego == null)
                {
                    return NotFound("No se encontró el videojuego con la id especificada");
                }
                return Ok(videojuego);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }


        // GET: VideogamesController/GetByGenre/string
        [HttpGet("GetVideogamesByGenre/{genre}")]
        public async Task<ActionResult> VideogamesByGenre(string genre)
        {
            try
            {
                var filterVideojuegos = await _context.Videojuegos.Where(v => v.Genero1 == genre
                || v.Genero2 == genre || v.Genero3 == genre).ToListAsync();
                if (!filterVideojuegos.Any())
                {
                    return NotFound("No se encontraron videojuegos con el género proporcionado.");
                }
                return Ok(filterVideojuegos);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        // GET: VideogamesController/GetByPlatform/string
        [HttpGet("GetVideogamesByPlatform/{plataforma}")]
        public async Task<ActionResult> VideogamesByPlatform(string plataforma)
        {
            try
            {
                var filterVideojuegos = await _context.Videojuegos.Where(v => v.Plataforma == plataforma).ToListAsync();
                if (!filterVideojuegos.Any())
                {
                    return NotFound("No se encontraron videojuegos para la plataforma proporcionada.");
                }
                return Ok(filterVideojuegos);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        // GET: VideogamesController/GetByName/string
        [HttpGet("GetByName/{nombre}")]
        public async Task<ActionResult> VideogamesByName(string nombre)
        {
            try
            {
                var filterVideojuegos = await _context.Videojuegos.Where(v => v.NombreVideojuego.Contains(nombre)).ToListAsync();
                if (!filterVideojuegos.Any())
                {
                    return NotFound("No se encontraron videojuegos para el nombre proporcionado.");
                }
                return Ok(filterVideojuegos);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        // GET: VideogamesController/GetByPrice/number
        [HttpGet("GetByPriceRange/{minPrice}/{maxPrice}")]
        public async Task<ActionResult> VideogamesByPriceRange(decimal minPrice, decimal maxPrice)
        {
            try
            {
                var filterVideojuegos = await _context.Videojuegos.Where(v =>
                    v.Precio >= minPrice && v.Precio <= maxPrice).ToListAsync();
                if (!filterVideojuegos.Any())
                {
                    return NotFound("No se encontraron videojuegos dentro del rango de precios proporcionado.");
                }
                return Ok(filterVideojuegos);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }



        // POST: VideogamesController/Create
        [HttpPost("Create")]
        public async Task<ActionResult> CreateVideogame(Videojuego videojuego)
        {
            try
            {
                // Obtén el último Videojuego creado
                var lastVideojuego = await _context.Videojuegos.OrderByDescending(v => v.Idvideojuego).FirstOrDefaultAsync();

                // Si no hay ningún Videojuego en la base de datos, asigna 1 al idVideojuego
                if (lastVideojuego == null)
                {
                    videojuego.Idvideojuego = 1;
                }
                else
                {
                    // Asigna al nuevo Videojuego un idVideojuego que sea 1 mayor que el último idVideojuego creado
                    videojuego.Idvideojuego = lastVideojuego.Idvideojuego + 1;
                }

                await _context.Videojuegos.AddAsync(videojuego);
                await _context.SaveChangesAsync();
                return Ok(videojuego);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        // PUT: VideogamesController/Edit/number
        [HttpPut("Edit/{id}")]
        public async Task<ActionResult> EditVideogame(int id, Videojuego videojuego)
        {
            try
            {
                _context.Update(videojuego);
                await _context.SaveChangesAsync();
                return Ok(videojuego);
            }
            catch
            {
                return StatusCode(500, "Error al actualizar el juego");
            }
        }


        // DELETE: VideogamesController/Delete/number
        [HttpDelete("Delete/{id}")]
        public async Task<ActionResult> DeleteVideogame(int id)
        {
            try
            {
                var findVideojuego = await _context.Videojuegos.FindAsync(id);
                if (findVideojuego != null)
                {
                    _context.Videojuegos.Remove(findVideojuego);
                    await _context.SaveChangesAsync();
                    return StatusCode(200);
                }
                else
                {
                    return NotFound("El videojuego no se encontró");
                }
            }
            catch
            {
                return StatusCode(500);
            }
        }
    }
}