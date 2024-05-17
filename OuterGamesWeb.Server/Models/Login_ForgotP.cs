namespace OuterGamesWeb.Server.Models
{
    public class LoginModel
    {
        public int IdUsuario { get; set; }
        public string? CorreoElectronico { get; set; }
        public string? Contrasena { get; set; }
    }

    public class ForgotPasswordModel
    {
        public string? CorreoElectronico { get; set; }
    }
}
