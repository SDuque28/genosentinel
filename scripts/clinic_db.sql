create database clinic_db;
use clinic_db;

CREATE TABLE patients (
  id            int NOT NULL auto_increment,      
  first_name   VARCHAR(100) NOT NULL,
  last_name    VARCHAR(100) NOT NULL,
  birth_date   DATE         NOT NULL,
  gender       ENUM('M','F') NOT NULL,
  status       enum('Activo', 'Seguimiento', 'Desactivado' )  NOT NULL,       
  PRIMARY KEY (id)
);

CREATE TABLE tumor_types (
  id              INT AUTO_INCREMENT,
  name            VARCHAR(150) NOT NULL,  
  system_affected VARCHAR(150) NOT NULL,    
  PRIMARY KEY (id)
);

CREATE TABLE clinical_records (
  id                  int   NOT NULL auto_increment,
  patient_id          INT   NOT NULL,  
  tumor_type_id       INT        NOT NULL,  
  diagnosis_date      DATE       NOT NULL,
  stage               VARCHAR(20),
  treatment_protocol  VARCHAR(255),
  PRIMARY KEY (id),
  CONSTRAINT fk_clinical_tumor FOREIGN KEY (tumor_type_id) REFERENCES tumor_types(id),
   CONSTRAINT fk_patienr FOREIGN KEY (patient_id) REFERENCES patients(id)
);