package com.genosentinel.auth_gateway.dto.genomic;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GeneticVariantDto {
    private UUID id;
    private Long gene;

    @JsonProperty("gene_details")
    private GeneDto geneDetails;

    private String chromosome;
    private Long position;

    @JsonProperty("reference_base")
    private String referenceBase;

    @JsonProperty("alternate_base")
    private String alternateBase;

    private String impact;

    @JsonProperty("created_at")
    private String createdAt;

    @JsonProperty("updated_at")
    private String updatedAt;
}