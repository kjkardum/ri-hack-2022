namespace RiHackApi.Chatbot.Models;

public class ChatbotRequest
{
    public ChatbotRequestData Params { get; set; }   
}

public class ChatbotRequestData
{
    public List<List<string>> prev_question_and_answers { get; set; }
    public string question { get; set; }
}