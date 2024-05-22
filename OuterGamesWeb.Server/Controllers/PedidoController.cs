using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OuterGamesWeb.Server.Models;
using System.IdentityModel.Tokens.Jwt;

namespace OuterGamesWeb.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PedidoController : Controller
    {
        private readonly OuterGamesContext _context;
        private readonly ILogger<PedidoController> _logger;

        //Constructor
        public PedidoController(OuterGamesContext context, ILogger<PedidoController> logger)
        {
            _context = context;
            _logger = logger;
        }

        //GET: pedidoController/GetOrder
        [HttpGet("GetOrders")]
        public async Task<ActionResult<IEnumerable<Pedido>>> GetOrder()
        {
            return await _context.Pedidos.ToListAsync();
        }

        // GET: pedidoController/GetOrderById/5
        [HttpGet("GetOrderById/{id}")]
        public async Task<ActionResult<Pedido>> GetPedido(int id)
        {
            var pedido = await _context.Pedidos.FindAsync(id);

            if (pedido == null)
            {
                return NotFound();
            }

            return pedido;
        }

        // GET: pedidoController/GetOrderById/5
        [HttpGet("GetOrdersByUserId/{id}")]
        public async Task<ActionResult<IEnumerable<Pedido>>> GetPedidosByUser(int id)
        {
            var pedidos = await _context.Pedidos.Where(p => p.Idusuario == id).ToListAsync();

            if (pedidos == null || pedidos.Count == 0)
            {
                return NotFound();
            }

            return pedidos;
        }

        //POST: pedidoController/CreateOrder/number
        [HttpPost("CreateOrder")]
        public async Task<ActionResult<Pedido>> PostPedido(Pedido pedido)
        {
            var lastPedido = _context.Pedidos.OrderByDescending(o => o.Idpedido).FirstOrDefault();
            var pedidoExistente = await _context.Pedidos.FindAsync(pedido.Idpedido);

            if (pedidoExistente != null)
            {
                return BadRequest("El ID del pedido ya está registrado.");
            }
            pedido.Idpedido = (lastPedido == null) ? 1 : lastPedido.Idpedido + 1;
            _context.Pedidos.Add(pedido);
            await _context.SaveChangesAsync();

            return Ok(pedido);
        }


        [HttpPut("EditOrder/{id}")]
        public async Task<IActionResult> EditOrder(int id, Pedido pedido)
        {
            if (id != pedido.Idpedido)
            {
                return BadRequest();
            }

            _context.Entry(pedido).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PedidoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        private bool PedidoExists(int id)
            {
                return _context.Pedidos.Any(e => e.Idpedido == id);
            }

        }
}
