namespace OuterGamesWeb.Server.Models
{
    public class LoginModel
    {
        public string? CorreoElectronico { get; set; }
        public string? Contrasena { get; set; }
    }

    public class ForgotPasswordModel
    {
        public string? CorreoElectronico { get; set; }
    }
}
