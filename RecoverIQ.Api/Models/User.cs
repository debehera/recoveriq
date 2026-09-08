using System.ComponentModel.DataAnnotations;

namespace RecoverIQ.Api.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string Role { get; set; } = string.Empty; // "Admin" or "TeamMember"

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}