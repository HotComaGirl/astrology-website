document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    // Retrieve user details
    const userDOB = sessionStorage.getItem("dob");
    const userTOB = sessionStorage.getItem("tob");
    const userPOB = sessionStorage.getItem("pob");
    const userAPIKey = sessionStorage.getItem("apiKey");

    if (!userDOB || !userTOB || !userPOB || !userAPIKey) {
        alert("Missing details! Please fill in your astrology details first.");
        window.location.href = "index.html"; // Redirect back
    }

    // Function to encrypt API key before sending
    async function encryptAPIKey(apiKey) {
        const encoder = new TextEncoder();
        const data = encoder.encode(apiKey);
        const key = await crypto.subtle.digest('SHA-256', data);
        return btoa(String.fromCharCode(...new Uint8Array(key))); // Base64 encoding
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

        // Encrypt API Key
        const encryptedAPIKey = await encryptAPIKey(userAPIKey);

        // API Call
        try {
            const response = await fetch("https://astrology-bot-worker.mahima-gandhi15.workers.dev/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: `Use astrology to answer my question. My astrological details are: 
                           DOB: ${userDOB}, Time: ${userTOB}, Place: ${userPOB}. 
                           My question is: ${userText}`,
                    encryptedApiKey: encryptedAPIKey
                })
            });

            const responseData = await response.json();
            loadingMessage.remove();

            // Append bot response
            const botMessage = document.createElement("div");
            botMessage.classList.add("bot-message");
            botMessage.textContent = responseData.choices ? responseData.choices[0].message.content : "Error: No response received.";
            chatBox.appendChild(botMessage);

        } catch (error) {
            loadingMessage.remove();

            // Show error message
            const errorMessage = document.createElement("div");
            errorMessage.classList.add("bot-message");
            errorMessage.textContent = "Error: Unable to fetch response. Please try again.";
            chatBox.appendChild(errorMessage);
            console.error("API Request Failed:", error);
        }

        // Auto-scroll to latest message
        chatBox.scrollTop = chatBox.scrollHeight;
    });
});
