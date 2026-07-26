package com.buildguard.service.impl;

import java.io.ByteArrayOutputStream;

import org.springframework.stereotype.Service;

import com.buildguard.service.ReportService;
import com.itextpdf.text.Document;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;

@Service
public class ReportServiceImpl implements ReportService {

    @Override
    public byte[] generateProjectReport(Long projectId) {

        try {

            Document document = new Document();

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

            PdfWriter.getInstance(document, outputStream);

            document.open();

            document.add(new Paragraph("BuildGuard Project Report"));

            document.add(new Paragraph("Project ID : " + projectId));

            document.add(new Paragraph("Generated Successfully"));

            document.close();

            return outputStream.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}