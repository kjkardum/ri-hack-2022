namespace RiHackApi.Chatbot.Models;

public class ChatbotResponse
{
    public string Response { get; set; }

    public ChatbotResponse(string response)
    {
        Response = response;
    }
}