using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OuterGamesWeb.Server.Models;

namespace OuterGamesWeb.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DetallesPedidoController : Controller
    {
        private readonly OuterGamesContext _context;
        private readonly ILogger<DetallesPedidoController> _logger;

        //Constructor
        public DetallesPedidoController(OuterGamesContext context, ILogger<DetallesPedidoController> logger)
        {
            _context = context;
            _logger = logger;
        }
        //GET: GetAllDetailsOrders/
        [HttpGet("GetDetailsOrders")]
        public async Task<ActionResult<IEnumerable<DetallesPedido>>> GetDetailsOrder()
        {
            try
            {
                return await _context.DetallesPedidos.ToListAsync();
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            
        }

        //POST: CreateDetailsOrder/
        [HttpPost("CreateDetailsOrder")]
        public async Task<ActionResult> CreateOrder(List<DetallesPedido> detalles)
        {
            foreach (var detalle in detalles)
            {
                var findVideojuego = await _context.Videojuegos.FindAsync(detalle.Idvideojuego);

                if (findVideojuego == null)
                {
                    return NotFound($"Videojuego con ID {detalle.Idvideojuego} no encontrado.");
                }
                _context.DetallesPedidos.Add(detalle);
            }
            await _context.SaveChangesAsync();
            return Ok(detalles);
        }

    }
}
