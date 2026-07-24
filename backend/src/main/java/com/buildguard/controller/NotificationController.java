package com.buildguard.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.buildguard.dto.NotificationResponseDto;
import com.buildguard.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")

public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    public NotificationResponseDto createNotification(
            @RequestParam String title,
            @RequestParam String message,
            @RequestParam String type,
            @RequestParam Long userId) {

        return notificationService.createNotification(
                title,
                message,
                type,
                userId);
    }

    @GetMapping
    public List<NotificationResponseDto> getAllNotifications() {
        return notificationService.getAllNotifications();
    }

    @GetMapping("/{id}")
    public NotificationResponseDto getNotificationById(@PathVariable Long id) {
        return notificationService.getNotificationById(id);
    }

    @GetMapping("/user/{userId}")
    public List<NotificationResponseDto> getNotificationsByUser(
            @PathVariable Long userId) {

        return notificationService.getNotificationsByUser(userId);
    }

    @PutMapping("/{id}/read")
    public NotificationResponseDto markAsRead(@PathVariable Long id) {
        return notificationService.markAsRead(id);
    }

    @DeleteMapping("/{id}")
    public String deleteNotification(@PathVariable Long id) {

        notificationService.deleteNotification(id);

        return "Notification deleted successfully.";
    }
}