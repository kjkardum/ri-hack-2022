using Refit;
using RiHackApi.Chatbot.Models;

namespace RiHackApi.Chatbot.Interfaces;

public interface IChatbotService
{
    [Post("/chat")]
    public Task<ChatbotResponse> SendQuestion(MyQueryParams queryParams, [Body] ChatbotRequest body);
}

public class MyQueryParams
{
    [AliasAs("API_KEY")]
    public string API_KEY { get; set; }

    public MyQueryParams(string api_key)
    {
        API_KEY = api_key;
    }
}