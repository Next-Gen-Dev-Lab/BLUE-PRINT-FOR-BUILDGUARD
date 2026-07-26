package com.buildguard.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.buildguard.dto.NotificationResponseDto;
import com.buildguard.entity.Notification;
import com.buildguard.entity.User;
import com.buildguard.mapper.NotificationMapper;
import com.buildguard.repository.NotificationRepository;
import com.buildguard.repository.UserRepository;
import com.buildguard.service.NotificationService;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;

    public NotificationServiceImpl(
            NotificationRepository notificationRepository,
            UserRepository userRepository,
            NotificationMapper notificationMapper) {

        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.notificationMapper = notificationMapper;
    }

    @Override
    public NotificationResponseDto createNotification(
            String title,
            String message,
            String type,
            Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = new Notification();

        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setIsRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setUser(user);

        return notificationMapper.toDto(notificationRepository.save(notification));
    }

    @Override
    public List<NotificationResponseDto> getAllNotifications() {

        return notificationRepository.findAll()
                .stream()
                .map(notificationMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public NotificationResponseDto getNotificationById(Long id) {

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        return notificationMapper.toDto(notification);
    }

    @Override
    public List<NotificationResponseDto> getNotificationsByUser(Long userId) {

        return notificationRepository.findByUserId(userId)
                .stream()
                .map(notificationMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public NotificationResponseDto markAsRead(Long id) {

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setIsRead(true);

        return notificationMapper.toDto(notificationRepository.save(notification));
    }

    @Override
    public void deleteNotification(Long id) {

        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notificationRepository.delete(notification);
    }
}