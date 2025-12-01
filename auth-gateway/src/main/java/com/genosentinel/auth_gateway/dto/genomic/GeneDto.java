package com.genosentinel.auth_gateway.dto.genomic;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GeneDto {
    private Long id;
    private String symbol;

    @JsonProperty("full_name")
    private String fullName;

    @JsonProperty("function_summary")
    private String functionSummary;

    @JsonProperty("created_at")
    private String createdAt;

    @JsonProperty("updated_at")
    private String updatedAt;
}