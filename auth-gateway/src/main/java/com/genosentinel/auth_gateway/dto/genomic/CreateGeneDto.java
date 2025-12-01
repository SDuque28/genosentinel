package com.genosentinel.auth_gateway.dto.genomic;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateGeneDto {

    @NotBlank(message = "Symbol is required")
    private String symbol;

    @NotBlank(message = "Full name is required")
    @JsonProperty("full_name")
    private String fullName;

    @NotBlank(message = "Function summary is required")
    @JsonProperty("function_summary")
    private String functionSummary;
}