document.addEventListener('DOMContentLoaded', () => {
    // Initialize all DOM elements
    const elements = {
        resetBtn: document.getElementById('resetBtn'),
        meetingForm: document.getElementById('meetingForm'),
        addAgendaItemBtn: document.getElementById('addAgendaItem'),
        agendaItems: document.getElementById('agendaItems'),
        copyBtn: document.getElementById('copyBtn'),
        copyMeetingBtn: document.getElementById('copyMeetingBtn'),
        participants: document.getElementById('participants')
    };

    // Check if all required elements exist
    const missingElements = Object.entries(elements)
        .filter(([key, element]) => !element)
        .map(([key]) => key);

    if (missingElements.length > 0) {
        console.error('Missing required elements:', missingElements.join(', '));
        return;
    }

    // Add reset button functionality
    elements.resetBtn.addEventListener('click', () => {
        elements.meetingForm.reset();
        elements.agendaItems.innerHTML = '';
        elements.participants.value = '';
        topicNumber = 1;
        createAgendaItem(1);
        topicNumber++;
    });

    // Initialize topic counter
    let topicNumber = 1;

    // Function to create a new agenda item
    function createAgendaItem(topicNum) {
        const agendaItem = document.createElement('div');
        agendaItem.classList.add('agenda-item');
        agendaItem.innerHTML = `
            <h3>Topic ${topicNum}</h3>
            <input type="text" class="topic" placeholder="Topic" required>
            <select class="objective" required>
                <option value="">Select Objective</option>
                <option value="FYI">FYI</option>
                <option value="Require feedback">Require feedback</option>
                <option value="Require action">Require action</option>
                <option value="Require decision">Require decision</option>
                <option value="Require approval">Require approval</option>
                <option value="Other">[custom]</option>
            </select>
            <input type="text" class="custom-objective" style="display: none;" placeholder="Custom Objective">
            <input type="text" class="audience" placeholder="Audience">
        `;
        elements.agendaItems.appendChild(agendaItem);

        const objectiveSelect = agendaItem.querySelector('.objective');
        const customObjective = agendaItem.querySelector('.custom-objective');

        if (objectiveSelect && customObjective) {
            objectiveSelect.addEventListener('change', () => {
                customObjective.style.display = objectiveSelect.value === 'Other' ? 'block' : 'none';
            });
        }

        const audienceInput = agendaItem.querySelector('.audience');
        if (audienceInput) {
            audienceInput.addEventListener('input', updateParticipants);
        }
    }

    // Create the first agenda item (Topic 1) on page load
    createAgendaItem(topicNumber);
    topicNumber++;

    elements.addAgendaItemBtn.addEventListener('click', () => {
        createAgendaItem(topicNumber);
        topicNumber++;
    });

    function updateParticipants() {
        const participantsInput = elements.participants;
        if (!participantsInput) return;
        
        const audienceInputs = document.querySelectorAll('.audience');
        const participants = new Set();

        audienceInputs.forEach(input => {
            if (input && input.value) {
                input.value.split(',').forEach(name => {
                    const trimmedName = name.trim();
                    if (trimmedName) {
                        participants.add(trimmedName);
                    }
                });
            }
        });

        const participantsList = Array.from(participants).join(', ');
        participantsInput.value = participantsList;
        participantsInput.placeholder = participantsList ? '' : '(auto-populated)';
    }

    function copyMeetingDetails(event) {
        if (!event || !event.target) return;
        
        const meetingDetails = getMeetingDetails();
        if (!meetingDetails) return;
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(meetingDetails)
                .then(() => {
                    showCopyMessage(event.target);
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    fallbackCopyTextToClipboard(meetingDetails, event.target);
                });
        } else {
            fallbackCopyTextToClipboard(meetingDetails, event.target);
        }
    }

    function fallbackCopyTextToClipboard(text, button) {
        if (!text || !button) return;
        
        const textArea = document.createElement("textarea");
        textArea.value = text;
        
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showCopyMessage(button);
            } else {
                console.error('Fallback: Unable to copy');
            }
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
    }

    function showCopyMessage(button) {
        if (!button) return;
        const copyMsg = button.closest('.copy-container')?.querySelector('.copy-msg');
        if (copyMsg) {
            copyMsg.style.display = 'inline';
            setTimeout(() => {
                copyMsg.style.display = 'none';
            }, 2000);
        }
    }

    // Add event listeners for copy buttons
    const copyButtons = [elements.copyBtn, elements.copyMeetingBtn].filter(Boolean);
    if (copyButtons.length > 0) {
        copyButtons.forEach(btn => {
            btn.addEventListener('click', copyMeetingDetails);
        });
    }

    elements.meetingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Implement form submission
        const formData = new FormData(elements.meetingForm);
        // Send formData to the server using fetch or XMLHttpRequest
        const formDataObj = {};
        for (let [key, value] of formData.entries()) {
            formDataObj[key] = value;
        }
        console.log('Form submitted:', formDataObj);
    });

    // Function to format date with English month spelling
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Add event listener to format date input display
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.addEventListener('change', (e) => {
            const formattedDate = formatDate(e.target.value);
            if (formattedDate) {
                e.target.setAttribute('data-formatted-date', formattedDate);
            }
        });
    }

    function getMeetingDetails() {
        if (!elements.participants) return '';
        
        const title = document.getElementById('title')?.value || '';
        const dateInput = document.getElementById('date');
        const date = dateInput ? formatDate(dateInput.value) : '';
        const createdBy = document.getElementById('createdBy')?.value || '';
        const participants = elements.participants.value || '';

        let meetingDetails = `Meeting: ${title}\nDate: ${date}\nCreated By: ${createdBy}\nParticipants: ${participants}\n\nAgenda:\n`;

        const agendaItems = document.querySelectorAll('.agenda-item');
        agendaItems.forEach((item, index) => {
            const topic = item.querySelector('.topic')?.value || '';
            const objective = item.querySelector('.objective')?.value || '';
            const customObjective = item.querySelector('.custom-objective')?.value || '';
            const audience = item.querySelector('.audience')?.value || '';

            meetingDetails += `${index + 1}. Topic: ${topic}\n`;
            meetingDetails += `   Objective: ${objective === 'Other' ? customObjective : objective}\n`;
            meetingDetails += `   Audience: ${audience}\n\n`;
        });

        return meetingDetails.trim();
    }
});