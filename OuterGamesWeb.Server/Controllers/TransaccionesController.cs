using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OuterGamesWeb.Server.Models;

namespace OuterGamesWeb.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransaccionesController : Controller
    {
        private readonly OuterGamesContext _context;
        private readonly ILogger<TransaccionesController> _logger;

        public TransaccionesController(OuterGamesContext context, ILogger<TransaccionesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("GetAllTransactions")]
        public async Task<ActionResult<IEnumerable<Transaccione>>> GetTransactions()
        {
            return await _context.Transacciones.ToListAsync();
        }

        [HttpGet("GetTransactionById/{id}")]
        public async Task<ActionResult<Transaccione>> GetTransaction(int id)
        {
            var findTransaction = await _context.Transacciones.FindAsync(id);

            if (findTransaction == null)
            {
                return NotFound("No se ha encontrado la transacción");
            }
            return findTransaction;
        }

        // GET: ByOrder/number
        [HttpGet("GetTransactionByOrder/{orderId}")]
        public async Task<ActionResult<IEnumerable<Transaccione>>> GetTransactionsByOrder(int orderId)
        {
            var findTransaction = await _context.Pedidos.FindAsync(orderId);
            if (findTransaction == null)
            {
                return BadRequest("No se ha encontrado una transacción con ese Id");
            }
            return await _context.Transacciones.Where(t => t.Idpedido == orderId).ToListAsync();
        }


        // POST: Transactions
        [HttpPost("CreateTransaction")]
        public async Task<ActionResult<Transaccione>> PostTransaction(Transaccione transaction)
        {
            try
            {
                _context.Transacciones.Add(transaction);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetTransaction", new { id = transaction.Idtransaccion }, transaction);
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

}

