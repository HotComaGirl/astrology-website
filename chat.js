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

        // Get the current date dynamically
        const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

        // API Call
        const response = await fetch("https://astrology-bot-worker.mahima-gandhi15.workers.dev/", {
            method: "POST",
            headers: { "Authorization": 'Bearer ${userAPIKey}', "Content-Type": "text/event-stream" },
            body: JSON.stringify({
                query: `1) Use astrology to answer my question with accuracy.  
                        
                            a) If my question is about when something will happen, analyze my entire lifetime and provide the most likely time period(s) for the 
                            event. If possible, include specific dates or time ranges. Do not limit the prediction to just the near future.
                            b) If my question is about whether something will happen within a specific period (e.g., tomorrow, 2039, or 2040), consider only that 
                            period for your prediction. Restrict the analysis strictly to the given timeframe and do not extend beyond it unless explicitly requested.
                            c) If my question is not time-related, focus only on astrological insights without introducing unnecessary time references.
                            d) Assume today’s date is ${currentDate} (in [YYYY-MM-DD] format) when answering my question. Adjust all time-related calculations accordingly.
                        
                        2) **Strictly follow these rules**:  
                            - 🚫 DO NOT include phrases like "the future depends on other factors," "nothing is certain," or "free will affects outcomes."  
                            - 🚫 DO NOT discuss psychology, mindset, or personal effort—**stick to astrology only.**  
                            - ✅ ONLY provide answers based on astrology, such as planetary influences, transits, houses, signs, and aspects.  
                      
                       3) Keep your answer brief, yet complete
                       
                       4) My astrological details are: 
                       DOB: ${userDOB}, Time: ${userTOB}, Place: ${userPOB}. 
                       
                       5) My question is: ${userText}.`,
                apiKey: userAPIKey
            })
        });

    // Read Stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let botMessage = document.createElement("div");
    botMessage.classList.add("bot-message");
    chatBox.appendChild(botMessage);

    let fullResponse = ""; // Store complete response

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode chunk
        const chunkText = decoder.decode(value, { stream: true });

        // Extract "content" from the streamed JSON
        const regex = /"content":"(.*?)"/g;
        let match;
        let extractedText = "";

        while ((match = regex.exec(chunkText)) !== null) {
            extractedText += match[1]; // Collect all extracted content
        }

        if (extractedText) {
            fullResponse += extractedText; // Append to full response
            botMessage.textContent = fullResponse; // Update UI in real-time
        }

        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll
        }

        loadingMessage.remove(); // Remove "Thinking..." message
    });
});
