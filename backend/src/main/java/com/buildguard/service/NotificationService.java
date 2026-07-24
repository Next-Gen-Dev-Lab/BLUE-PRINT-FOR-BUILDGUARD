package com.buildguard.service;

import java.util.List;

import com.buildguard.dto.NotificationResponseDto;

public interface NotificationService {

    NotificationResponseDto createNotification(
            String title,
            String message,
            String type,
            Long userId);

    List<NotificationResponseDto> getAllNotifications();

    NotificationResponseDto getNotificationById(Long id);

    List<NotificationResponseDto> getNotificationsByUser(Long userId);

    NotificationResponseDto markAsRead(Long id);

    void deleteNotification(Long id);
}