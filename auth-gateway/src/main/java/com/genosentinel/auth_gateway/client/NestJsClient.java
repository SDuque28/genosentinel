package com.genosentinel.auth_gateway.client;

import com.genosentinel.auth_gateway.dto.nestjs.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;

/**
 * Cliente para consumir los endpoints del microservicio NestJS
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class NestJsClient {

    private final RestClient nestJsRestClient;

    /**
     * Crear un nuevo paciente
     */
    public PatientResponseDto createPatient(CreatePatientDto patientData) {
        log.info("Creating patient: {}", patientData);

        return nestJsRestClient.post()
                .uri("/api/patients")
                .contentType(MediaType.APPLICATION_JSON)
                .body(patientData)
                .retrieve()
                .body(PatientResponseDto.class);
    }

    /**
     * Obtener todos los pacientes
     */
    public List<PatientResponseDto> getAllPatients() {
        log.info("Fetching all patients");

        return nestJsRestClient.get()
                .uri("/api/patients")
                .retrieve()
                .body(new ParameterizedTypeReference<>(){});
    }

    /**
     * Obtener un paciente por ID
     */
    public PatientResponseDto getPatientById(int id) {
        log.info("Fetching patient with id: {}", id);

        return nestJsRestClient.get()
                .uri("/api/patients/{id}", id)
                .retrieve()
                .body(PatientResponseDto.class);
    }

    /**
     * Actualizar un paciente
     */
    public PatientResponseDto updatePatient(int id, UpdatePatientDto patientData) {
        log.info("Updating patient with id: {}", id);

        return nestJsRestClient.patch()
                .uri("/api/patients/{id}", id)
                .contentType(MediaType.APPLICATION_JSON)
                .body(patientData)
                .retrieve()
                .body(PatientResponseDto.class);
    }

    /**
     * Desactivar un paciente
     */
    public PatientResponseDto deactivatePatient(int id) {
        log.info("Deactivating patient with id: {}", id);

        return nestJsRestClient.patch()
                .uri("/api/patients/{id}/deactivate", id)
                .retrieve()
                .body(PatientResponseDto.class);
    }

    /**
     * Crear un nuevo tipo de tumor
     */
    public TumorTypeDto createTumorType(CreateTumorTypeDto tumorTypeData) {
        log.info("Creating tumor type: {}", tumorTypeData);

        return nestJsRestClient.post()
                .uri("/api/tumor-types")
                .contentType(MediaType.APPLICATION_JSON)
                .body(tumorTypeData)
                .retrieve()
                .body(TumorTypeDto.class);
    }

    /**
     * Obtener todos los tipos de tumor
     */
    public List<TumorTypeDto> getAllTumorTypes() {
        log.info("Fetching all tumor types");

        return nestJsRestClient.get()
                .uri("/api/tumor-types")
                .retrieve()
                .body(new ParameterizedTypeReference<>(){});
    }

    /**
     * Obtener un tipo de tumor por ID
     */
    public TumorTypeDto getTumorTypeById(int id) {
        log.info("Fetching tumor type with id: {}", id);

        return nestJsRestClient.get()
                .uri("/api/tumor-types/{id}", id)
                .retrieve()
                .body(TumorTypeDto.class);
    }

    /**
     * Actualizar un tipo de tumor
     */
    public TumorTypeDto updateTumorType(int id, UpdateTumorTypeDto tumorTypeData) {
        log.info("Updating tumor type with id: {}", id);

        return nestJsRestClient.patch()
                .uri("/api/tumor-types/{id}", id)
                .contentType(MediaType.APPLICATION_JSON)
                .body(tumorTypeData)
                .retrieve()
                .body(TumorTypeDto.class);
    }

    /**
     * Eliminar un tipo de tumor
     */
    public DeleteResponseDto deleteTumorType(int id) {
        log.info("Deleting tumor type with id: {}", id);

        return nestJsRestClient.delete()
                .uri("/api/tumor-types/{id}", id)
                .retrieve()
                .body(DeleteResponseDto.class);
    }

    /**
     * Crear una nueva historia clínica
     */
    public ClinicalRecordDto createClinicalRecord(CreateClinicalRecordDto recordData) {
        log.info("Creating clinical record: {}", recordData);

        return nestJsRestClient.post()
                .uri("/api/clinical-records")
                .contentType(MediaType.APPLICATION_JSON)
                .body(recordData)
                .retrieve()
                .body(ClinicalRecordDto.class);
    }

    /**
     * Obtener todas las historias clínicas
     */
    public List<ClinicalRecordDto> getAllClinicalRecords() {
        log.info("Fetching all clinical records");

        return nestJsRestClient.get()
                .uri("/api/clinical-records")
                .retrieve()
                .body(new ParameterizedTypeReference<>(){});
    }

    /**
     * Obtener una historia clínica por ID
     */
    public ClinicalRecordDto getClinicalRecordById(int id) {
        log.info("Fetching clinical record with id: {}", id);

        return nestJsRestClient.get()
                .uri("/api/clinical-records/{id}", id)
                .retrieve()
                .body(ClinicalRecordDto.class);
    }

    /**
     * Actualizar una historia clínica
     */
    public ClinicalRecordDto updateClinicalRecord(int id, UpdateClinicalRecordDto recordData) {
        log.info("Updating clinical record with id: {}", id);

        return nestJsRestClient.patch()
                .uri("/api/clinical-records/{id}", id)
                .contentType(MediaType.APPLICATION_JSON)
                .body(recordData)
                .retrieve()
                .body(ClinicalRecordDto.class);
    }

    /**
     * Eliminar una historia clínica
     */
    public DeleteResponseDto deleteClinicalRecord(int id) {
        log.info("Deleting clinical record with id: {}", id);

        return nestJsRestClient.delete()
                .uri("/api/clinical-records/{id}", id)
                .retrieve()
                .body(DeleteResponseDto.class);
    }
}