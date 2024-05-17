using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;
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
        public async Task<IActionResult> CreateOrderDetails(List<DetallesPedido> detalles)
        {
            if (detalles == null || !detalles.Any())
            {
                return BadRequest("Detalles del pedido no pueden estar vacíos.");
            }

            // Obtener el último id de detallePedido
            var lastDetails = _context.DetallesPedidos.OrderByDescending(d => d.IddetallePedido).FirstOrDefault();
            int nextId = (lastDetails == null) ? 1 : lastDetails.IddetallePedido + 1;

            // Evitar duplicación de entidades y asignar IDs únicos
            foreach (var detalle in detalles)
            {
                // Asignar un id único y creciente para cada nuevo detalle
                detalle.IddetallePedido = nextId++;

                // Verificar si la entidad ya está siendo rastreada y si es así, desacoplarla
                if (_context.DetallesPedidos.Local.Any(dp => dp.IddetallePedido == detalle.IddetallePedido))
                {
                    _context.Entry(detalle).State = EntityState.Detached;
                }

                // Asignar estado de añadido solo si no está siendo rastreado
                if (!_context.DetallesPedidos.Local.Any(dp => dp.IddetallePedido == detalle.IddetallePedido))
                {
                    _context.DetallesPedidos.Add(detalle);
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                // Manejo de errores específicos
                return StatusCode(500, "Error al guardar los detalles del pedido: " + ex.Message);
            }

            return Ok(detalles);
        }

    }
}
