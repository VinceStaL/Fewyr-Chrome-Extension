document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('resetBtn').addEventListener('click', () => {
        document.getElementById('meetingForm').reset();
        const agendaItems = document.getElementById('agendaItems');
        agendaItems.innerHTML = '';
        document.getElementById('participants').value = '';
        createAgendaItem(1);
    });

    const meetingForm = document.getElementById('meetingForm');
    const addAgendaItemBtn = document.getElementById('addAgendaItem');
    const agendaItems = document.getElementById('agendaItems');
    const copyBtn = document.getElementById('copyBtn');
    const copyMeetingBtn = document.getElementById('copyMeetingBtn');
    const signInBtn = document.getElementById('signInBtn');
    const shareBtn = document.getElementById('shareBtn');
    const signOutBtn = document.getElementById('signOutBtn');
    const saveMeetingBtn = document.getElementById('saveMeetingBtn');

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
        agendaItems.appendChild(agendaItem);

        const objectiveSelect = agendaItem.querySelector('.objective');
        const customObjective = agendaItem.querySelector('.custom-objective');

        objectiveSelect.addEventListener('change', () => {
            customObjective.style.display = objectiveSelect.value === 'Other' ? 'block' : 'none';
        });

        const audienceInput = agendaItem.querySelector('.audience');
        audienceInput.addEventListener('input', updateParticipants);
    }

    // Create the first agenda item (Topic 1) on page load
    createAgendaItem(topicNumber);
    topicNumber++;

    addAgendaItemBtn.addEventListener('click', () => {
        createAgendaItem(topicNumber);
        topicNumber++;
    });

    function updateParticipants() {
        const participantsInput = document.getElementById('participants');
        const audienceInputs = document.querySelectorAll('.audience');
        const participants = new Set();

        audienceInputs.forEach(input => {
            input.value.split(',').forEach(name => {
                const trimmedName = name.trim();
                if (trimmedName) {
                    participants.add(trimmedName);
                }
            });
        });

        const participantsList = Array.from(participants).join(', ');
        if (participantsList) {
            participantsInput.value = participantsList;
            participantsInput.placeholder = '';
        } else {
            participantsInput.value = '';
            participantsInput.placeholder = '(auto-populated)';
        }
    }

    function copyMeetingDetails(event) {
        const meetingDetails = getMeetingDetails();
        
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

    copyBtn.addEventListener('click', copyMeetingDetails);
    copyMeetingBtn.addEventListener('click', copyMeetingDetails);

    function fallbackCopyTextToClipboard(text, button) {
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
        const copyMsg = button.nextElementSibling;
        copyMsg.style.display = 'inline';
        setTimeout(() => {
            copyMsg.style.display = 'none';
        }, 2000);
    }

    // Remove or comment out the following event listener
    // signInBtn.addEventListener('click', () => {
    //     // Implement sign in functionality
    //     // For now, we'll just simulate a successful sign-in
    //     signInBtn.style.display = 'none';
    //     shareBtn.style.display = 'inline';
    //     signOutBtn.style.display = 'inline';
    //     saveMeetingBtn.style.display = 'inline'; // Show the Save Meeting button
    // });

    shareBtn.addEventListener('click', () => {
        // Implement share functionality
        const meetingUrl = window.location.href;
        navigator.clipboard.writeText(meetingUrl).then(() => {
            alert(`Meeting URL copied: ${meetingUrl}`);
        });
    });

    signOutBtn.addEventListener('click', () => {
        // Implement sign out functionality
        signInBtn.style.display = 'inline';
        shareBtn.style.display = 'none';
        signOutBtn.style.display = 'none';
        saveMeetingBtn.style.display = 'none'; // Hide the Save Meeting button
    });

    meetingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Implement form submission
        const formData = new FormData(meetingForm);
        // Send formData to the server using fetch or XMLHttpRequest
        console.log('Form submitted:', Object.fromEntries(formData));
    });

    function getMeetingDetails() {
        const title = document.getElementById('title').value;
        const date = document.getElementById('date').value;
        const createdBy = document.getElementById('createdBy').value;
        const participants = document.getElementById('participants').value;

        let meetingDetails = `Meeting: ${title}\nDate: ${date}\nCreated By: ${createdBy}\nParticipants: ${participants}\n\nAgenda:\n`;

        const agendaItems = document.querySelectorAll('.agenda-item');
        agendaItems.forEach((item, index) => {
            const topic = item.querySelector('.topic').value;
            const objective = item.querySelector('.objective').value;
            const customObjective = item.querySelector('.custom-objective').value;
            const audience = item.querySelector('.audience').value;

            meetingDetails += `${index + 1}. Topic: ${topic}\n`;
            meetingDetails += `   Objective: ${objective === 'Other' ? customObjective : objective}\n`;
            meetingDetails += `   Audience: ${audience}\n\n`;
        });

        return meetingDetails.trim();
    }
});