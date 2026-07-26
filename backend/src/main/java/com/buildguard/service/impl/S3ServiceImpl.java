package com.buildguard.service.impl;

import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.buildguard.service.S3Service;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
public class S3ServiceImpl implements S3Service {

    private final S3Client s3Client;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    public S3ServiceImpl(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    @Override
    public String uploadFile(MultipartFile file) {

        try {

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(
                    putObjectRequest,
                    RequestBody.fromBytes(file.getBytes())
            );

            return "https://" + bucketName + ".s3.ap-south-1.amazonaws.com/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("File upload failed", e);
        }
    }

    @Override
    public void deleteFile(String fileKey) {

        DeleteObjectRequest deleteObjectRequest =
                DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(fileKey)
                        .build();

        s3Client.deleteObject(deleteObjectRequest);
    }
}