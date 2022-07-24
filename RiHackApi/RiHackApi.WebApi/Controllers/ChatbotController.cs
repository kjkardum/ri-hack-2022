using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using RiHackApi.Chatbot.Interfaces;
using RiHackApi.Chatbot.Models;
using RiHackApi.Common.Settings;
using RiHackApi.Router.interfaces;
using RiHackApi.WebApi.Controllers.Base;
using MyQueryParams = RiHackApi.Chatbot.Interfaces.MyQueryParams;

namespace RiHackApi.WebApi.Controllers;

public class ChatbotController : BaseApiController
{
    private readonly MyQueryParams _apiKey;
    private readonly IChatbotService _chatbotService;

    public ChatbotController(IChatbotService chatbotService, IOptions<ApplicationSettings> applicationSettings)
    {
        _chatbotService = chatbotService;
        _apiKey = new MyQueryParams(applicationSettings.Value.ChatbotApiKey ?? string.Empty);
    }
    
    [HttpPost]
    public async Task<IActionResult> Post(ChatbotRequest request)
    {
        var response = await _chatbotService.SendQuestion(_apiKey, request);
        return Ok(response);
    }
}