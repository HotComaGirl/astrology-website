document.addEventListener("DOMContentLoaded", function () {
    const chatInput = document.getElementById("chat-input");
    const chatSubmit = document.getElementById("chat-submit");
    const chatContainer = document.getElementById("chat-container");

    chatSubmit.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });

    async function sendMessage() {
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        // Display user message
        displayMessage(userMessage, "user");
        chatInput.value = "";

        // API Call to Cloudflare Worker
        try {
            const response = await fetch("https://astrology-bot-worker.mahima-gandhi15.workers.dev/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ query: userMessage })
            });

            if (!response.ok) {
                console.error("Server Error:", await response.text());
                displayMessage("Error: Unable to fetch response.", "bot");
                return;
            }

            // Handle streaming response
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let botMessage = "";
            let botMessageElement = displayMessage("", "bot");

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });

                // Extract actual content from streamed data
                const lines = chunk.split("\n").filter(line => line.trim() !== "");
                for (const line of lines) {
                    if (line.startsWith("data:")) {
                        try {
                            const token = line.substring(5).trim(); // Extract token
                            botMessage += token;
                            botMessageElement.innerText = botMessage; // Update message live
                        } catch (err) {
                            console.error("Parsing Error:", err);
                        }
                    }
                }
            }

        } catch (error) {
            console.error("Request Failed:", error);
            displayMessage("Error: Unable to connect to the server.", "bot");
        }
    }

    function displayMessage(text, sender) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", sender);
        messageDiv.innerText = text;
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        return messageDiv;
    }
});
