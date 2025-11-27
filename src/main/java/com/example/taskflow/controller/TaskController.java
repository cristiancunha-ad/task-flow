package com.example.taskflow.controller;

import com.example.taskflow.model.Task;
import com.example.taskflow.repository.TaskRepository;
import com.example.taskflow.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskController(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    //Obtener todas las tareas
    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    //Crear tarea
    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return taskRepository.save(task);
    }

    //Obtener tareas por ID de ususario
    @GetMapping("/user/{userId}")
    public List<Task> getTasksByUser(@PathVariable Long userId) {
        return taskRepository.findAll().stream().filter(task -> task.getUser().getId().equals(userId)).toList();
    }

    //Marcar una tarea como completada
    @PutMapping("/{id}/complete")
    public Task markTaskAsCompleted(@PathVariable Long id) {
        Task task = taskRepository.findById(id).orElse(null);
        if (task != null) {
            task.setCompleted(true);
            taskRepository.save(task);
        }
        return null;
    }

    //Actualizar tarea
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        return taskRepository.findById(id).map(task -> {
            task.setTitle(taskDetails.getTitle());
            task.setDescription(taskDetails.getDescription());
            task.setCompleted(taskDetails.isCompleted());
            // Si se envía un usuario nuevo, se podría actualizar aquí también
            if (taskDetails.getUser() != null) {
                task.setUser(taskDetails.getUser());
            }
            return taskRepository.save(task);
        }).orElse(null);
    }

    //Borrar tarea
    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskRepository.deleteById(id);
    }
}