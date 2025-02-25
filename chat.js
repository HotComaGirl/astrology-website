document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    const userDOB = sessionStorage.getItem("dob");
    const userTOB = sessionStorage.getItem("tob");
    const userPOB = sessionStorage.getItem("pob");
    const userAPIKey = "abcd";

    if (!userDOB || !userTOB || !userPOB || !userAPIKey) {
        alert("Missing details! Please fill in your astrology details first.");
        window.location.href = "index.html"; 
    }

    sendBtn.addEventListener("click", async () => {
        const userText = userInput.value.trim();
        if (!userText) return;

        const userMessage = document.createElement("div");
        userMessage.classList.add("user-message");
        userMessage.textContent = userText;
        chatBox.appendChild(userMessage);

        userInput.value = "";

        const loadingMessage = document.createElement("div");
        loadingMessage.classList.add("bot-message");
        loadingMessage.textContent = "🔮 ";
        chatBox.appendChild(loadingMessage);

        const eventSource = new EventSource("https://astrology-bot-worker.mahima-gandhi15.workers.dev/");

        let botMessage = document.createElement("div");
        botMessage.classList.add("bot-message");
        chatBox.appendChild(botMessage);

        eventSource.onmessage = (event) => {
            if (event.data) {
                botMessage.textContent += event.data;
                chatBox.scrollTop = chatBox.scrollHeight;
            }
        };

        eventSource.onerror = (error) => {
            console.error("Streaming error:", error);
            eventSource.close();
        };
    });
});
