document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    // Retrieve user details
    const userDOB = sessionStorage.getItem("dob");
    const userTOB = sessionStorage.getItem("tob");
    const userPOB = sessionStorage.getItem("pob");
    //const userAPIKey = sessionStorage.getItem("apiKey");
    const userAPIKey = "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";

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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                query: `Use astrology to answer my question with accuracy. Focus on specific timeframes and astrological reasoning. My astrological details are: 
                       Important: Keep your answer brief yet complete.
                       DOB: ${userDOB}, Time: ${userTOB}, Place: ${userPOB}. Just for your information, we are currently in year 2025.
                       My question is: ${userText}. If possible, provide a specific date or time range in your response.`,
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
