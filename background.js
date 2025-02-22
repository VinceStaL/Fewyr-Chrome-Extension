// Handle extension installation or update
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('Fewyr Extension installed');
        // Initialize storage with empty meeting data
        chrome.storage.local.set({ meetings: [] });
    } else if (details.reason === 'update') {
        console.log('Fewyr Extension updated');
    }
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GET_MEETING_DATA') {
        // Retrieve meeting data from local storage
        chrome.storage.local.get(['meetings'], (result) => {
            sendResponse({ success: true, data: result.meetings || [] });
        });
    } else if (request.type === 'SAVE_MEETING_DATA') {
        // Save meeting data to local storage
        const meetingData = request.data;
        chrome.storage.local.get(['meetings'], (result) => {
            const meetings = result.meetings || [];
            meetings.push(meetingData);
            chrome.storage.local.set({ meetings }, () => {
                sendResponse({ success: true });
            });
        });
    }
    return true; // Required for async response
});