package com.ayurkisan.Modules.Chatbot;

public class ChatbotRequest {
    private String message;
    private String userId;
    private String userName;
    private String context; // Current state of conversation (e.g., ADVISOR_HAIR_FALL)

    public ChatbotRequest() {}

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getContext() { return context; }
    public void setContext(String context) { this.context = context; }
}
