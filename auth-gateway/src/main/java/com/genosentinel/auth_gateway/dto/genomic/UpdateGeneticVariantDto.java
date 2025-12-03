package com.genosentinel.auth_gateway.dto.genomic;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateGeneticVariantDto {
    private Long gene;
    private String chromosome;
    private Long position;

    @JsonProperty("reference_base")
    private String referenceBase;

    @JsonProperty("alternate_base")
    private String alternateBase;

    private String impact;
}