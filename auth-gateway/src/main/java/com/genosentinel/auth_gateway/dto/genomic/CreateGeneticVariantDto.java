package com.genosentinel.auth_gateway.dto.genomic;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateGeneticVariantDto {

    @NotNull(message = "Gene ID is required")
    private Long gene;

    @NotBlank(message = "Chromosome is required")
    private String chromosome;

    @NotNull(message = "Position is required")
    private Long position;

    @NotBlank(message = "Reference base is required")
    @JsonProperty("reference_base")
    private String referenceBase;

    @NotBlank(message = "Alternate base is required")
    @JsonProperty("alternate_base")
    private String alternateBase;

    @NotBlank(message = "Impact is required")
    private String impact;
}