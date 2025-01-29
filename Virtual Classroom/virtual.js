// Virtual Classroom Application

class VirtualClassroom {
    constructor() {
        this.currentUser = null;
        this.classrooms = [];
        this.activeClassroom = null;
        this.initializeElements();
        this.setupEventListeners();
        this.initWhiteboard();
    }

    initializeElements() {
        // Login Section
        this.loginSection = document.getElementById('loginSection');
        this.userTypeSelect = document.getElementById('userTypeSelect');
        this.usernameInput = document.getElementById('usernameInput');
        this.loginBtn = document.getElementById('loginBtn');

        // Dashboard
        this.classroomDashboard = document.getElementById('classroomDashboard');
        this.userProfileName = document.getElementById('userProfileName');
        this.userProfileType = document.getElementById('userProfileType');

        // Classroom Selection
        this.newClassroomName = document.getElementById('newClassroomName');
        this.createClassroomBtn = document.getElementById('createClassroomBtn');
        this.availableClassrooms = document.getElementById('availableClassrooms');

        // Active Classroom
        this.activeClassroomSection = document.getElementById('activeClassroom');
        this.activeClassroomName = document.getElementById('activeClassroomName');
        this.leaveClassroomBtn = document.getElementById('leaveClassroomBtn');

        // Chat
        this.chatMessages = document.getElementById('chatMessages');
        this.chatMessageInput = document.getElementById('chatMessageInput');
        this.sendMessageBtn = document.getElementById('sendMessageBtn');

        // Whiteboard
        this.whiteboardCanvas = document.getElementById('whiteboardCanvas');
        this.clearWhiteboardBtn = document.getElementById('clearWhiteboardBtn');
        this.colorPicker = document.getElementById('colorPicker');
        this.lineWidth = document.getElementById('lineWidth');

        // File Sharing
        this.fileInput = document.getElementById('fileInput');
        this.shareFilesBtn = document.getElementById('shareFilesBtn');
        this.sharedFilesList = document.getElementById('sharedFilesList');
    }

    setupEventListeners() {
        // Login
        this.loginBtn.addEventListener('click', () => this.login());

        // Classroom Creation
        this.createClassroomBtn.addEventListener('click', () => this.createClassroom());

        // Classroom Interactions
        this.leaveClassroomBtn.addEventListener('click', () => this.leaveClassroom());

        // Chat
        this.sendMessageBtn.addEventListener('click', () => this.sendMessage());
        this.chatMessageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Whiteboard
        this.whiteboardCanvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.whiteboardCanvas.addEventListener('mousemove', (e) => this.draw(e));
        this.whiteboardCanvas.addEventListener('mouseup', () => this.stopDrawing());
        this.whiteboardCanvas.addEventListener('mouseout', () => this.stopDrawing());
        this.clearWhiteboardBtn.addEventListener('click', () => this.clearWhiteboard());

        // File Sharing
        this.shareFilesBtn.addEventListener('click', () => this.shareFiles());
    }

    login() {
        const username = this.usernameInput.value.trim();
        if (!username) {
            alert('Please enter a username');
            return;
        }

        this.currentUser = {
            username: username,
            type: this.userTypeSelect.value
        };

        this.loginSection.classList.add('hidden');
        this.classroomDashboard.classList.remove('hidden');

        this.userProfileName.textContent = username;
        this.userProfileType.textContent = this.currentUser.type.charAt(0).toUpperCase() + this.currentUser.type.slice(1);

        this.loadAvailableClassrooms();
    }

    createClassroom() {
        const classroomName = this.newClassroomName.value.trim();
        if (!classroomName) {
            alert('Please enter a classroom name');
            return;
        }

        const newClassroom = {
            id: Date.now(),
            name: classroomName,
            messages: [],
            files: []
        };

        this.classrooms.push(newClassroom);
        this.loadAvailableClassrooms();
        this.newClassroomName.value = '';
    }

    loadAvailableClassrooms() {
        this.availableClassrooms.innerHTML = '';
        this.classrooms.forEach(classroom => {
            const classroomCard = document.createElement('div');
            classroomCard.classList.add('classroom-card');
            classroomCard.textContent = classroom.name;
            classroomCard.addEventListener('click', () => this.joinClassroom(classroom));
            this.availableClassrooms.appendChild(classroomCard);
        });
    }

    joinClassroom(classroom) {
        this.activeClassroom = classroom;
        this.activeClassroomName.textContent = classroom.name;
        
        // Show active classroom section
        document.getElementById('classroomSelection').classList.add('hidden');
        this.activeClassroomSection.classList.remove('hidden');

        // Render existing messages
        this.renderMessages();
    }

    leaveClassroom() {
        this.activeClassroom = null;
        this.activeClassroomSection.classList.add('hidden');
        document.getElementById('classroomSelection').classList.remove('hidden');
        this.clearWhiteboard();
    }

    sendMessage() {
        const message = this.chatMessageInput.value.trim();
        if (!message) return;

        const newMessage = {
            user: this.currentUser.username,
            text: message,
            timestamp: new Date()
        };

        this.activeClassroom.messages.push(newMessage);
        this.renderMessages();
        this.chatMessageInput.value = '';
    }

    renderMessages() {
        this.chatMessages.innerHTML = '';
        this.activeClassroom.messages.forEach(msg => {
            const messageEl = document.createElement('div');
            messageEl.innerHTML = `
                <strong>${msg.user}</strong>: ${msg.text}
                <small>${msg.timestamp.toLocaleTimeString()}</small>
            `;
            this.chatMessages.appendChild(messageEl);
        });
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    // Whiteboard Functionality
    initWhiteboard() {
        this.ctx = this.whiteboardCanvas.getContext('2d');
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
    }

    startDrawing(e) {
        this.isDrawing = true;
        [this.lastX, this.lastY] = [e.offsetX, e.offsetY];
    }

    draw(e) {
        if (!this.isDrawing) return;
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(e.offsetX, e.offsetY);
        this.ctx.strokeStyle = this.colorPicker.value;
        this.ctx.lineWidth = this.lineWidth.value;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();
        [this.lastX, this.lastY] = [e.offsetX, e.offsetY];
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    clearWhiteboard() {
        this.ctx.clearRect(0, 0, this.whiteboardCanvas.width, this.whiteboardCanvas.height);
    }

    // File Sharing
    shareFiles() {
        const files = this.fileInput.files;
        if (files.length === 0) {
            alert('Please select files to share');
            return;
        }

        Array.from(files).forEach(file => {
            this.activeClassroom.files.push({
                name: file.name,
                size: file.size,
                type: file.type
            });
            
            const fileItem = document.createElement('li');
            fileItem.textContent = `${file.name} (${this.formatFileSize(file.size)})`;
            this.sharedFilesList.appendChild(fileItem);
        });

        this.fileInput.value = ''; // Clear file input
    }

    formatFileSize(bytes) {
        if (bytes < 1024) return `${bytes} bytes`;
        if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / 1048576).toFixed(1)} MB`;
    }
}

// Initialize the Virtual Classroom
document.addEventListener('DOMContentLoaded', () => {
    new VirtualClassroom();
});