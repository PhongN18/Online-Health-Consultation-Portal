namespace BackendOHCP.Models;
public class RegisterRequest
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string Role { get; set; } // "patient", "doctor", "admin"
    public string FirstName { get; set; }
    public string LastName { get; set; }
}
