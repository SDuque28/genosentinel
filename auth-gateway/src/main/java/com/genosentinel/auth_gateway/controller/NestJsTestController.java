package com.genosentinel.auth_gateway.controller;

import com.genosentinel.auth_gateway.client.NestJsClient;
import com.genosentinel.auth_gateway.dto.nestjs.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
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

/**
 * Controlador para probar endpoints del microservicio NestJS
 */
@RestController
@RequestMapping("/nestjs")
@RequiredArgsConstructor
@Tag(name = "Clinic", description = "Endpoints del microservicio de la clínica (NestJS)")
public class NestJsTestController {

    private final NestJsClient nestJsClient;

    @Operation(
            summary = "Crear paciente en NestJS",
            description = "Prueba la creación de un paciente en el microservicio NestJS",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Paciente creado exitosamente"
            ),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PostMapping("/patients")
    public ResponseEntity<PatientResponseDto> createPatient(
            @Valid @RequestBody CreatePatientDto patientData) {

        PatientResponseDto result = nestJsClient.createPatient(patientData);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @Operation(
            summary = "Listar todos los pacientes",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista de pacientes"
            )
    })
    @GetMapping("/patients")
    public ResponseEntity<List<PatientResponseDto>> getAllPatients() {

        List<PatientResponseDto> result = nestJsClient.getAllPatients();
        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "Obtener paciente por ID",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Paciente encontrado"
            ),
            @ApiResponse(responseCode = "404", description = "Paciente no encontrado")
    })
    @GetMapping("/patients/{id}")
    public ResponseEntity<PatientResponseDto> getPatientById(
            @PathVariable int id) {

        PatientResponseDto result = nestJsClient.getPatientById(id);
        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "Actualizar paciente",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Paciente actualizado"
            ),
            @ApiResponse(responseCode = "404", description = "Paciente no encontrado")
    })
    @PatchMapping("/patients/{id}")
    public ResponseEntity<PatientResponseDto> updatePatient(
            @PathVariable int id,
            @Valid @RequestBody UpdatePatientDto patientData) {

        PatientResponseDto result = nestJsClient.updatePatient(id, patientData);
        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "Desactivar paciente",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @ApiResponse(responseCode = "404", description = "Paciente no encontrado")
    @PatchMapping("/patients/{id}/deactivate")
    public ResponseEntity<PatientResponseDto> deactivatePatient(@PathVariable int id) {

        PatientResponseDto result = nestJsClient.deactivatePatient(id);
        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "Crear tipo de tumor",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Tipo de tumor creado"
            ),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PostMapping("/tumor-types")
    public ResponseEntity<TumorTypeDto> createTumorType(@Valid @RequestBody CreateTumorTypeDto tumorTypeData) {

        TumorTypeDto result = nestJsClient.createTumorType(tumorTypeData);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @Operation(
            summary = "Listar todos los tipos de tumor",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @GetMapping("/tumor-types")
    public ResponseEntity<List<TumorTypeDto>> getAllTumorTypes() {

        List<TumorTypeDto> result = nestJsClient.getAllTumorTypes();
        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "Obtener tipo de tumor por ID",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @ApiResponse(responseCode = "404", description = "Tumor no encontrado")
    @GetMapping("/tumor-types/{id}")
    public ResponseEntity<TumorTypeDto> getTumorTypeById(@PathVariable int id) {

        TumorTypeDto result = nestJsClient.getTumorTypeById(id);
        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "Actualizar tipo de tumor",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Tipo de tumor actualizado"
            ),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "404", description = "Tipo de tumor no encontrado")
    })
    @PatchMapping("/tumor-types/{id}")
    public ResponseEntity<TumorTypeDto> updateTumorType(
            @PathVariable int id,
            @Valid @RequestBody UpdateTumorTypeDto tumorTypeData) {

        TumorTypeDto result = nestJsClient.updateTumorType(id, tumorTypeData);
        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "Eliminar tipo de tumor",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @ApiResponse(responseCode = "404", description = "Tipo de tumor no encontrado",content = @Content)
    @DeleteMapping("/tumor-types/{id}")
    public ResponseEntity<DeleteResponseDto> deleteTumorType(@PathVariable int id) {

        DeleteResponseDto result = nestJsClient.deleteTumorType(id);
        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "Crear historia clínica en NestJS",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Historia clínica creada"
            ),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "404", description = "Paciente o tipo de tumor no encontrado")
    })
    @PostMapping("/clinical-records")
    public ResponseEntity<ClinicalRecordDto> createClinicalRecord(
            @Valid @RequestBody CreateClinicalRecordDto recordData) {

        ClinicalRecordDto result = nestJsClient.createClinicalRecord(recordData);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @Operation(
            summary = "Listar todas las historias clínicas",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @ApiResponse(responseCode = "200", description = "Historias clínicas obtenidas")
    @GetMapping("/clinical-records")
    public ResponseEntity<List<ClinicalRecordDto>> getAllClinicalRecords() {

        List<ClinicalRecordDto> result = nestJsClient.getAllClinicalRecords();
        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "Obtener historia clínica por ID",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @ApiResponse(responseCode = "404", description = "Historia clínica no encontrada")
    @GetMapping("/clinical-records/{id}")
    public ResponseEntity<ClinicalRecordDto> getClinicalRecordById(@PathVariable int id) {

        ClinicalRecordDto result = nestJsClient.getClinicalRecordById(id);
        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "Actualizar historia clínica",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Historia clínica actualizada"
            ),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "404", description = "Paciente o tipo de tumor no encontrado")
    })
    @PatchMapping("/clinical-records/{id}")
    public ResponseEntity<ClinicalRecordDto> updateClinicalRecord(
            @PathVariable int id,
            @Valid @RequestBody UpdateClinicalRecordDto recordData) {

        ClinicalRecordDto result = nestJsClient.updateClinicalRecord(id, recordData);
        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "Eliminar historia clínica",
            security = @SecurityRequirement(name = "bearer-jwt")
    )
    @ApiResponse(responseCode = "404", description = "Historia clínica no encontrada")
    @DeleteMapping("/clinical-records/{id}")
    public ResponseEntity<DeleteResponseDto> deleteClinicalRecord(@PathVariable int id) {

        DeleteResponseDto result = nestJsClient.deleteClinicalRecord(id);
        return ResponseEntity.ok(result);
    }
}