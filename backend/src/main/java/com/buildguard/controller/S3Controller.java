package com.buildguard.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.buildguard.service.S3Service;

@RestController
@RequestMapping("/api/s3")
@CrossOrigin("*")
public class S3Controller {

    private final S3Service s3Service;

    public S3Controller(S3Service s3Service) {
        this.s3Service = s3Service;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile file) {

        String url = s3Service.uploadFile(file);

        return ResponseEntity.ok(url);
    }
}