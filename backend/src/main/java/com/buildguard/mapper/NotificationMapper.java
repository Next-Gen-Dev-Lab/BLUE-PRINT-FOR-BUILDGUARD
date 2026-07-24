package com.buildguard.mapper;

import org.springframework.stereotype.Component;

import com.buildguard.dto.NotificationResponseDto;
import com.buildguard.entity.Notification;

@Component
public class NotificationMapper {

    public NotificationResponseDto toDto(Notification notification) {

        if (notification == null) {
            return null;
        }

        NotificationResponseDto dto = new NotificationResponseDto();

        dto.setId(notification.getId());
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setType(notification.getType());
        dto.setIsRead(notification.getIsRead());
        dto.setCreatedAt(notification.getCreatedAt());

        if (notification.getUser() != null) {
            dto.setUserId(notification.getUser().getId());
        }

        return dto;
    }

    public Notification toEntity(NotificationResponseDto dto) {

        if (dto == null) {
            return null;
        }

        Notification notification = new Notification();

        notification.setId(dto.getId());
        notification.setTitle(dto.getTitle());
        notification.setMessage(dto.getMessage());
        notification.setType(dto.getType());
        notification.setIsRead(dto.getIsRead());
        notification.setCreatedAt(dto.getCreatedAt());

        return notification;
    }
}