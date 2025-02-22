document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    // Retrieve user details
    const userDOB = sessionStorage.getItem("dob");
    const userTOB = sessionStorage.getItem("tob");
    const userPOB = sessionStorage.getItem("pob");
    //const userAPIKey = sessionStorage.getItem("apiKey");
    const userAPIKey = "abcd";

    if (!userDOB || !userTOB || !userPOB || !userAPIKey) {
        alert("Missing details! Please fill in your astrology details first.");
        window.location.href = "index.html"; // Redirect back
    }

    sendBtn.addEventListener("click", async () => {
        const userText = userInput.value.trim();
        if (!userText) return;

        // Append user message
        const userMessage = document.createElement("div");
        userMessage.classList.add("user-message");
        userMessage.textContent = userText;
        chatBox.appendChild(userMessage);

        // Clear input
        userInput.value = "";

        // Show loading
        const loadingMessage = document.createElement("div");
        loadingMessage.classList.add("bot-message");
        loadingMessage.textContent = "Thinking...";
        chatBox.appendChild(loadingMessage);

        // API Call
        const response = await fetch("https://astrology-bot-worker.mahima-gandhi15.workers.dev/", {
            method: "POST",
            headers: { "Authorization": 'Bearer ${userAPIKey}', "Content-Type": "application/json" },
            body: JSON.stringify({
                query: `1) Use astrology to answer my question with accuracy.  
                            a) If my question is about **when something will happen**, consider my **entire lifetime**, not just the current or next few years. 
                              If possible, provide a specific date or time range in your response, covering all relevant future periods.Provide specific timeframes, dates, or periods when possible.  
                            b) If my question is **not time-related**, focus only on astrological insights without adding unnecessary time references.  
       2) **Strictly follow these rules**:  
          - 🚫 DO NOT include phrases like "the future depends on other factors," "nothing is certain," or "free will affects outcomes."  
          - 🚫 DO NOT discuss psychology, mindset, or personal effort—**stick to astrology only.**  
          - ✅ ONLY provide answers based on astrology, such as planetary influences, transits, houses, signs, and aspects.  
                       3) Keep your answer brief, yet complete
                       3) My astrological details are: 
                       DOB: ${userDOB}, Time: ${userTOB}, Place: ${userPOB}. 
                       4) My question is: ${userText}.`,
                apiKey: userAPIKey
            })
        });

        const responseData = await response.json();
        loadingMessage.remove();

        // Append bot response
        const botMessage = document.createElement("div");
        botMessage.classList.add("bot-message");
        botMessage.textContent = responseData.choices[0].message.content;
        chatBox.appendChild(botMessage);

        chatBox.scrollTop = chatBox.scrollHeight;
    });
});
