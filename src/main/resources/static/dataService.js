/**
 * Data Service for TaskFlow
 * Handles persistence using localStorage to replace the Java backend.
 */

const STORAGE_KEYS = {
    USERS: 'taskflow_users',
    TASKS: 'taskflow_tasks',
    USER_ID_SEQ: 'taskflow_user_id_seq',
    TASK_ID_SEQ: 'taskflow_task_id_seq'
};

const DataService = {
    // --- Helpers ---
    _getUsers() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    },

    _saveUsers(users) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    },

    _getTasks() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]');
    },

    _saveTasks(tasks) {
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    },

    _getNextId(key) {
        const current = parseInt(localStorage.getItem(key) || '0');
        const next = current + 1;
        localStorage.setItem(key, next.toString());
        return next;
    },

    // --- Users API ---
    async getUsers() {
        // Simulate network delay if desired, but not strictly necessary
        return this._getUsers();
    },

    async createUser(user) {
        const users = this._getUsers();
        const newUser = {
            ...user,
            id: this._getNextId(STORAGE_KEYS.USER_ID_SEQ)
        };
        users.push(newUser);
        this._saveUsers(users);
        return newUser;
    },

    async updateUser(id, userDetails) {
        const users = this._getUsers();
        const index = users.findIndex(u => u.id == id);
        if (index !== -1) {
            users[index] = { ...users[index], ...userDetails };
            this._saveUsers(users);
            
            // Also update user info in tasks
            const tasks = this._getTasks();
            let tasksUpdated = false;
            tasks.forEach(task => {
                if (task.user && task.user.id == id) {
                    task.user = users[index];
                    tasksUpdated = true;
                }
            });
            if (tasksUpdated) this._saveTasks(tasks);

            return users[index];
        }
        return null;
    },

    async deleteUser(id) {
        let users = this._getUsers();
        users = users.filter(u => u.id != id);
        this._saveUsers(users);

        // Optional: Cascade delete tasks or unassign them
        // For now, let's unassign them to be safe
        const tasks = this._getTasks();
        let tasksUpdated = false;
        tasks.forEach(task => {
            if (task.user && task.user.id == id) {
                task.user = null;
                tasksUpdated = true;
            }
        });
        if (tasksUpdated) this._saveTasks(tasks);
    },

    // --- Tasks API ---
    async getTasks() {
        return this._getTasks();
    },

    async createTask(task) {
        const tasks = this._getTasks();
        
        // Resolve user object if only ID is provided
        let fullUser = null;
        if (task.user && task.user.id) {
            const users = this._getUsers();
            fullUser = users.find(u => u.id == task.user.id);
        }

        const newTask = {
            ...task,
            id: this._getNextId(STORAGE_KEYS.TASK_ID_SEQ),
            user: fullUser
        };
        tasks.push(newTask);
        this._saveTasks(tasks);
        return newTask;
    },

    async updateTask(id, taskDetails) {
        const tasks = this._getTasks();
        const index = tasks.findIndex(t => t.id == id);
        if (index !== -1) {
            // Resolve user object if provided
            let fullUser = tasks[index].user;
            if (taskDetails.user && taskDetails.user.id) {
                const users = this._getUsers();
                fullUser = users.find(u => u.id == taskDetails.user.id) || null;
            }

            tasks[index] = { 
                ...tasks[index], 
                ...taskDetails,
                user: fullUser 
            };
            this._saveTasks(tasks);
            return tasks[index];
        }
        return null;
    },

    async deleteTask(id) {
        let tasks = this._getTasks();
        tasks = tasks.filter(t => t.id != id);
        this._saveTasks(tasks);
    }
};

// Export for use in index.html
window.DataService = DataService;
