package com.genosentinel.auth_gateway.client;

import com.genosentinel.auth_gateway.dto.genomic.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.UUID;

/**
 * Cliente para consumir los endpoints del microservicio Django Genomic
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DjangoGenomicClient {

    private final RestClient djangoGenomicRestClient;

    // ========== GENES ==========

    /**
     * Crear un nuevo gen
     */
    public GeneDto createGene(CreateGeneDto geneData) {
        log.info("Creating gene: {}", geneData);

        return djangoGenomicRestClient.post()
                .uri("/api/genes/")
                .contentType(MediaType.APPLICATION_JSON)
                .body(geneData)
                .retrieve()
                .body(GeneDto.class);
    }

    /**
     * Obtener todos los genes
     */
    public List<GeneDto> getAllGenes() {
        log.info("Fetching all genes");

        return djangoGenomicRestClient.get()
                .uri("/api/genes/")
                .retrieve()
                .body(new ParameterizedTypeReference<>(){});
    }

    /**
     * Obtener un gen por ID
     */
    public GeneDto getGeneById(Long id) {
        log.info("Fetching gene with id: {}", id);

        return djangoGenomicRestClient.get()
                .uri("/api/genes/{id}/", id)
                .retrieve()
                .body(GeneDto.class);
    }

    /**
     * Actualizar un gen
     */
    public GeneDto updateGene(Long id, UpdateGeneDto geneData) {
        log.info("Updating gene with id: {}", id);

        return djangoGenomicRestClient.patch()
                .uri("/api/genes/{id}/", id)
                .contentType(MediaType.APPLICATION_JSON)
                .body(geneData)
                .retrieve()
                .body(GeneDto.class);
    }

    /**
     * Eliminar un gen
     */
    public void deleteGene(Long id) {
        log.info("Deleting gene with id: {}", id);

        djangoGenomicRestClient.delete()
                .uri("/api/genes/{id}/", id)
                .retrieve()
                .toBodilessEntity();
    }

    // ========== GENETIC VARIANTS ==========

    /**
     * Crear una nueva variante genética
     */
    public GeneticVariantDto createGeneticVariant(CreateGeneticVariantDto variantData) {
        log.info("Creating genetic variant: {}", variantData);

        return djangoGenomicRestClient.post()
                .uri("/api/variants/")
                .contentType(MediaType.APPLICATION_JSON)
                .body(variantData)
                .retrieve()
                .body(GeneticVariantDto.class);
    }

    /**
     * Obtener todas las variantes genéticas
     */
    public List<GeneticVariantDto> getAllGeneticVariants() {
        log.info("Fetching all genetic variants");

        return djangoGenomicRestClient.get()
                .uri("/api/variants/")
                .retrieve()
                .body(new ParameterizedTypeReference<>(){});
    }

    /**
     * Obtener una variante genética por ID
     */
    public GeneticVariantDto getGeneticVariantById(UUID id) {
        log.info("Fetching genetic variant with id: {}", id);

        return djangoGenomicRestClient.get()
                .uri("/api/variants/{id}/", id)
                .retrieve()
                .body(GeneticVariantDto.class);
    }

    /**
     * Actualizar una variante genética
     */
    public GeneticVariantDto updateGeneticVariant(UUID id, UpdateGeneticVariantDto variantData) {
        log.info("Updating genetic variant with id: {}", id);

        return djangoGenomicRestClient.patch()
                .uri("/api/variants/{id}/", id)
                .contentType(MediaType.APPLICATION_JSON)
                .body(variantData)
                .retrieve()
                .body(GeneticVariantDto.class);
    }

    /**
     * Eliminar una variante genética
     */
    public void deleteGeneticVariant(UUID id) {
        log.info("Deleting genetic variant with id: {}", id);

        djangoGenomicRestClient.delete()
                .uri("/api/variants/{id}/", id)
                .retrieve()
                .toBodilessEntity();
    }

    // ========== PATIENT VARIANT REPORTS ==========

    /**
     * Crear un nuevo reporte de variante de paciente
     */
    public PatientVariantReportDto createPatientVariantReport(CreatePatientVariantReportDto reportData) {
        log.info("Creating patient variant report: {}", reportData);

        return djangoGenomicRestClient.post()
                .uri("/api/reports/")
                .contentType(MediaType.APPLICATION_JSON)
                .body(reportData)
                .retrieve()
                .body(PatientVariantReportDto.class);
    }

    /**
     * Obtener todos los reportes de variantes de pacientes
     */
    public List<PatientVariantReportDto> getAllPatientVariantReports() {
        log.info("Fetching all patient variant reports");

        return djangoGenomicRestClient.get()
                .uri("/api/reports/")
                .retrieve()
                .body(new ParameterizedTypeReference<>(){});
    }

    /**
     * Obtener un reporte de variante de paciente por ID
     */
    public PatientVariantReportDto getPatientVariantReportById(UUID id) {
        log.info("Fetching patient variant report with id: {}", id);

        return djangoGenomicRestClient.get()
                .uri("/api/reports/{id}/", id)
                .retrieve()
                .body(PatientVariantReportDto.class);
    }

    /**
     * Actualizar un reporte de variante de paciente
     */
    public PatientVariantReportDto updatePatientVariantReport(UUID id, UpdatePatientVariantReportDto reportData) {
        log.info("Updating patient variant report with id: {}", id);

        return djangoGenomicRestClient.patch()
                .uri("/api/reports/{id}/", id)
                .contentType(MediaType.APPLICATION_JSON)
                .body(reportData)
                .retrieve()
                .body(PatientVariantReportDto.class);
    }

    /**
     * Eliminar un reporte de variante de paciente
     */
    public void deletePatientVariantReport(UUID id) {
        log.info("Deleting patient variant report with id: {}", id);

        djangoGenomicRestClient.delete()
                .uri("/api/reports/{id}/", id)
                .retrieve()
                .toBodilessEntity();
    }
}