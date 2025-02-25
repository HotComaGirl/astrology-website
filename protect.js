document.addEventListener("contextmenu", (event) => event.preventDefault()); // Disable right-click

document.addEventListener("keydown", (event) => {
    if (event.key === "F12" || 
        (event.ctrlKey && event.shiftKey && event.key === "I") || 
        (event.ctrlKey && event.shiftKey && event.key === "J") || 
        (event.ctrlKey && event.key === "U")) {
        event.preventDefault();
    }
});

document.addEventListener("dragstart", (event) => event.preventDefault()); // Prevent dragging
document.addEventListener("selectstart", (event) => event.preventDefault()); // Prevent text selection
