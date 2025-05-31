document.addEventListener('DOMContentLoaded', () => {
    // API endpoint - Render deployment
    const API_URL = 'https://minutes-ai-o4k9.onrender.com/api';
    
    // DOM elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const textForm = document.getElementById('text-form');
    const fileForm = document.getElementById('file-form');
    const meetingText = document.getElementById('meeting-text');
    const meetingFile = document.getElementById('meeting-file');
    const fileName = document.getElementById('file-name');
    const loader = document.getElementById('loader');
    const results = document.getElementById('results');
    const summaryText = document.getElementById('summary-text');
    const decisionsList = document.getElementById('decisions-list');
    const actionItems = document.getElementById('action-items');
    const sample1Btn = document.getElementById('sample1-btn');
    const sample2Btn = document.getElementById('sample2-btn');
    
    // Tab switching functionality
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            btn.classList.add('active');
            const tabId = `${btn.dataset.tab}-tab`;
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // File input change handler
    meetingFile.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            fileName.textContent = e.target.files[0].name;
        } else {
            fileName.textContent = 'No file selected';
        }
    });
    
    // Text form submit handler
    textForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const text = meetingText.value.trim();
        if (!text) {
            alert('Please enter meeting notes');
            return;
        }
        
        try {
            showLoader();
            const data = await processText(text);
            displayResults(data);
        } catch (error) {
            handleError(error);
        }
    });
    
    // File form submit handler
    fileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!meetingFile.files.length) {
            alert('Please select a file');
            return;
        }
        
        const file = meetingFile.files[0];
        if (file.type !== 'text/plain') {
            alert('Please upload a .txt file');
            return;
        }
        
        try {
            showLoader();
            const data = await processFile(file);
            displayResults(data);
        } catch (error) {
            handleError(error);
        }
    });
    
    // Sample data - hardcoded to avoid file loading issues
    const sampleData = {
        sample1: `Product Team Meeting - June 1, 2025

Attendees: Sarah (PM), Mike (Design), Jen (Engineering), David (QA)

Agenda:
1. Product roadmap review
2. Feature prioritization
3. UI/UX improvements
4. Release timeline

Discussion:
- Sarah presented Q3 roadmap with focus on mobile experience
- Team agreed to prioritize checkout flow optimization for next sprint
- Mike showed new dashboard mockups, received positive feedback
- Jen raised concerns about API performance under load
- David suggested implementing automated UI testing to catch regressions
- Team decided to push back analytics feature to Q4
- Next release scheduled for July 15

Action Items:
- Mike to finalize dashboard design by June 10
- Jen to investigate API caching solutions by June 15
- David to implement test automation framework by end of month
- Sarah to update stakeholders on timeline changes by Friday`,
        sample2: `Weekly Team Sync - May 28, 2025

Present: Alex (Lead), Taylor, Jordan, Casey, Morgan

Project Status:
- Backend API is 80% complete
- Frontend components library finished
- QA environment setup pending

Discussions:
- Alex reported successful client demo yesterday
- Taylor completed user authentication module ahead of schedule
- Jordan facing issues with third-party payment integration
- Team discussed switching to new cloud provider due to cost concerns
- Decision made to adopt new testing framework
- Casey will be on vacation next week

Next Steps:
- Morgan to help Jordan with payment integration issues
- Taylor to document authentication module by Friday
- All team members to complete cloud migration training by June 5
- Alex to schedule follow-up client demo for June 10`
    };

    // Sample data buttons
    sample1Btn.addEventListener('click', async () => {
        try {
            showLoader();
            const text = sampleData.sample1;
            meetingText.value = text;
            
            // Switch to text tab
            tabBtns[0].click();
            
            const data = await processText(text);
            displayResults(data);
        } catch (error) {
            handleError(error);
        }
    });
    
    sample2Btn.addEventListener('click', async () => {
        try {
            showLoader();
            const text = sampleData.sample2;
            meetingText.value = text;
            
            // Switch to text tab
            tabBtns[0].click();
            
            const data = await processText(text);
            displayResults(data);
        } catch (error) {
            handleError(error);
        }
    });
    
    // Process text function
    async function processText(text) {
        const response = await fetch(`${API_URL}/process-meeting`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json();
    }
    
    // Process file function
    async function processFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${API_URL}/process-meeting-file`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json();
    }
    
    // Display results function
    function displayResults(data) {
        // Hide loader and show results
        loader.style.display = 'none';
        results.style.display = 'block';
        
        // Display summary
        summaryText.textContent = data.summary;
        
        // Display decisions
        decisionsList.innerHTML = '';
        data.decisions.forEach(decision => {
            const li = document.createElement('li');
            li.textContent = decision;
            decisionsList.appendChild(li);
        });
        
        // Display action items
        actionItems.innerHTML = '';
        data.actionItems.forEach(item => {
            const actionItem = document.createElement('div');
            actionItem.className = 'action-item';
            
            const header = document.createElement('div');
            header.className = 'action-item-header';
            
            const task = document.createElement('div');
            task.className = 'action-item-task';
            task.textContent = item.task;
            
            const owner = document.createElement('div');
            owner.className = 'action-item-owner';
            owner.textContent = item.owner || 'Unassigned';
            
            header.appendChild(task);
            header.appendChild(owner);
            
            actionItem.appendChild(header);
            
            if (item.due) {
                const due = document.createElement('div');
                due.className = 'action-item-due';
                due.textContent = `Due: ${item.due}`;
                actionItem.appendChild(due);
            }
            
            actionItems.appendChild(actionItem);
        });
        
        // Scroll to results
        document.getElementById('output-section').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Show loader function
    function showLoader() {
        loader.style.display = 'block';
        results.style.display = 'none';
    }
    
    // Handle error function
    function handleError(error) {
        console.error('Error:', error);
        loader.style.display = 'none';
        alert(`Error: ${error.message}`);
    }
});
