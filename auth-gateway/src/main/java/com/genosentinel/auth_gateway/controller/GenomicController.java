package com.genosentinel.auth_gateway.controller;

import com.genosentinel.auth_gateway.client.DjangoGenomicClient;
import com.genosentinel.auth_gateway.dto.genomic.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Controlador para endpoints del microservicio Django Genomic
 */
@RestController
@RequestMapping("/genomic")
@RequiredArgsConstructor
@Tag(name = "Genomic", description = "Endpoints del microservicio de genómica (Django)")
public class GenomicController {

    private final DjangoGenomicClient genomicClient;

    // ========== GENES ==========

    @Operation(
            summary = "Crear gen",
            description = "Crea un nuevo gen en el sistema genómico",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Gen creado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PostMapping("/genes")
    public ResponseEntity<GeneDto> createGene(@Valid @RequestBody CreateGeneDto geneData) {
        GeneDto result = genomicClient.createGene(geneData);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @Operation(
            summary = "Listar todos los genes"
    )
    @GetMapping("/genes")
    public ResponseEntity<List<GeneDto>> getAllGenes() {
        List<GeneDto> result = genomicClient.getAllGenes();
        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "Obtener gen por ID",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @ApiResponse(responseCode = "404", description = "Gen no encontrado")
    @GetMapping("/genes/{id}")
    public ResponseEntity<GeneDto> getGeneById(@PathVariable Long id) {
        GeneDto result = genomicClient.getGeneById(id);
        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "Actualizar gen",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Gen actualizado"),
            @ApiResponse(responseCode = "404", description = "Gen no encontrado")
    })
    @PatchMapping("/genes/{id}")
    public ResponseEntity<GeneDto> updateGene(
            @PathVariable Long id,
            @Valid @RequestBody UpdateGeneDto geneData) {
        GeneDto result = genomicClient.updateGene(id, geneData);
        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "Eliminar gen",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @ApiResponse(responseCode = "404", description = "Gen no encontrado")
    @DeleteMapping("/genes/{id}")
    public ResponseEntity<Void> deleteGene(@PathVariable Long id) {
        genomicClient.deleteGene(id);
        return ResponseEntity.noContent().build();
    }

    // ========== GENETIC VARIANTS ==========

    @Operation(
            summary = "Crear variante genética",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Variante creada exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PostMapping("/variants")
    public ResponseEntity<GeneticVariantDto> createGeneticVariant(
            @Valid @RequestBody CreateGeneticVariantDto variantData) {
        GeneticVariantDto result = genomicClient.createGeneticVariant(variantData);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @Operation(
            summary = "Listar todas las variantes genéticas",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @GetMapping("/variants")
    public ResponseEntity<List<GeneticVariantDto>> getAllGeneticVariants() {
        List<GeneticVariantDto> result = genomicClient.getAllGeneticVariants();
        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "Obtener variante genética por ID",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @ApiResponse(responseCode = "404", description = "Variante no encontrada")
    @GetMapping("/variants/{id}")
    public ResponseEntity<GeneticVariantDto> getGeneticVariantById(@PathVariable UUID id) {
        GeneticVariantDto result = genomicClient.getGeneticVariantById(id);
        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "Actualizar variante genética",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Variante actualizada"),
            @ApiResponse(responseCode = "404", description = "Variante no encontrada")
    })
    @PatchMapping("/variants/{id}")
    public ResponseEntity<GeneticVariantDto> updateGeneticVariant(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateGeneticVariantDto variantData) {
        GeneticVariantDto result = genomicClient.updateGeneticVariant(id, variantData);
        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "Eliminar variante genética",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @ApiResponse(responseCode = "404", description = "Variante no encontrada")
    @DeleteMapping("/variants/{id}")
    public ResponseEntity<Void> deleteGeneticVariant(@PathVariable UUID id) {
        genomicClient.deleteGeneticVariant(id);
        return ResponseEntity.noContent().build();
    }

    // ========== PATIENT VARIANT REPORTS ==========

    @Operation(
            summary = "Crear reporte de variante de paciente",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Reporte creado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "404", description = "Paciente o variante no encontrado")
    })
    @PostMapping("/reports")
    public ResponseEntity<PatientVariantReportDto> createPatientVariantReport(
            @Valid @RequestBody CreatePatientVariantReportDto reportData) {
        PatientVariantReportDto result = genomicClient.createPatientVariantReport(reportData);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @Operation(
            summary = "Listar todos los reportes de variantes de pacientes",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @GetMapping("/reports")
    public ResponseEntity<List<PatientVariantReportDto>> getAllPatientVariantReports() {
        List<PatientVariantReportDto> result = genomicClient.getAllPatientVariantReports();
        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "Obtener reporte de variante de paciente por ID",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @ApiResponse(responseCode = "404", description = "Reporte no encontrado")
    @GetMapping("/reports/{id}")
    public ResponseEntity<PatientVariantReportDto> getPatientVariantReportById(@PathVariable UUID id) {
        PatientVariantReportDto result = genomicClient.getPatientVariantReportById(id);
        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "Actualizar reporte de variante de paciente",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reporte actualizado"),
            @ApiResponse(responseCode = "404", description = "Reporte no encontrado")
    })
    @PatchMapping("/reports/{id}")
    public ResponseEntity<PatientVariantReportDto> updatePatientVariantReport(
            @PathVariable UUID id,
            @Valid @RequestBody UpdatePatientVariantReportDto reportData) {
        PatientVariantReportDto result = genomicClient.updatePatientVariantReport(id, reportData);
        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "Eliminar reporte de variante de paciente",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @ApiResponse(responseCode = "404", description = "Reporte no encontrado")
    @DeleteMapping("/reports/{id}")
    public ResponseEntity<Void> deletePatientVariantReport(@PathVariable UUID id) {
        genomicClient.deletePatientVariantReport(id);
        return ResponseEntity.noContent().build();
    }
}