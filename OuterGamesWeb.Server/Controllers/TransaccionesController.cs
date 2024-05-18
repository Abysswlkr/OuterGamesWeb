using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using OuterGamesWeb.Server.Models;
using System.Text;

namespace OuterGamesWeb.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TransaccionesController : Controller
    {
        private readonly OuterGamesContext _context;
        private readonly ILogger<TransaccionesController> _logger;
        private static readonly HttpClient client = new HttpClient();

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
        public async Task<ActionResult> PostTransaction(Transaccione transaction)
        {
            try
            {
                var lastTransaction = _context.Transacciones.OrderByDescending(t => t.Idtransaccion).FirstOrDefault();
                transaction.Idtransaccion = (lastTransaction == null) ? 1 : lastTransaction.Idtransaccion + 1;
                _context.Transacciones.Add(transaction);
                await _context.SaveChangesAsync();
                return Ok(transaction);

            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("simulatePayment")]
        public IActionResult SimulatePayment([FromBody] PaymentRequest request)
        {
            var response = new
            {
                status = "success",
                transactionId = Guid.NewGuid().ToString(),
                amount = request.Amount,
                message = "Este es un pago simulado."
            };
            return Ok(response);
        }


    }

}

