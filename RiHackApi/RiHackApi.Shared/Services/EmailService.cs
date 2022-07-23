using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RiHackApi.Common.Interfaces;
using RiHackApi.Common.Settings;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace RiHackApi.Shared.Services;

public class EmailService : IEmailService
{
    private readonly EmailSettings _emailSettings;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IOptions<EmailSettings> emailSettings, ILogger<EmailService> logger)
    {
        _logger = logger;
        _emailSettings = emailSettings.Value;
    }

    public async Task SendEmail(EmailAddress emailAddress, string subject, string message, bool html = false, List<EmailAddress>? ccAddresses = null)
    {
        await SendEmail(new List<EmailAddress> { emailAddress }, subject, message, html, ccAddresses);
    }

    public async Task SendEmail(string email, string name, string subject, string message, bool html = false)
    {
        var emailAddress = new EmailAddress(email, name);
        await SendEmail(emailAddress, subject, message, html); 
    }

    public async Task SendEmail(List<EmailAddress> emailAddresses, string subject, string message, bool html = false, List<EmailAddress>? ccAddress = null)
    {
        _logger.LogInformation("Sending email to {EmailAddresses} with subject {Subject}",
            string.Join(", ", emailAddresses.Select(t => t.Email)), subject);

        if (_emailSettings.SendGridApiKey == "")
        {
            _logger.LogWarning("SendGrid API key is not set");
            _logger.LogInformation("SendGrid API key is not set, message: To {EmailAddresses} - {Subject}\n{Message}",
                string.Join(", ", emailAddresses.Select(t => t.Email)), subject, message);
            Console.WriteLine(
                $"SendGrid API key is not set, message: To {string.Join(", ", emailAddresses.Select(t => t.Email))} - {subject}\n{message}");
            return;
        }
        var client = new SendGridClient(_emailSettings.SendGridApiKey);

        var from = new EmailAddress(_emailSettings.From, _emailSettings.FromName);
        var plainContent = html ? null : message;
        var htmlContent = html ? message : null;
        var msg = emailAddresses.Count == 1
            ? MailHelper.CreateSingleEmail(from, emailAddresses.First(), subject, plainContent, htmlContent)
            : MailHelper.CreateSingleEmailToMultipleRecipients(from, emailAddresses, subject, plainContent, htmlContent);
        if (ccAddress is {Count: > 0})
        {
            msg.AddCcs(ccAddress);
        }
        await client.SendEmailAsync(msg);
    }

    // TODO
    public Task SendPasswordRequestUrl(string passwordResetLink, int userAccountId)
    {
        throw new NotImplementedException();
    }
}