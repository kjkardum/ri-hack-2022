using SendGrid.Helpers.Mail;

namespace RiHackApi.Common.Interfaces;

public interface IEmailService
{
    Task SendEmail(EmailAddress email, string subject, string message, bool html, List<EmailAddress>? ccAddresses);
    Task SendEmail(List<EmailAddress> emails, string subject, string message, bool html, List<EmailAddress>? ccAddresses);
    Task SendEmail(string email, string name, string subject, string message, bool html);
    Task SendPasswordRequestUrl(string passwordResetLink, int userAccountId);
}