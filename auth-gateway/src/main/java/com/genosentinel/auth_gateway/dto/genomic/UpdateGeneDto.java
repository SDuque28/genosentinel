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
public class UpdateGeneDto {
    private String symbol;

    @JsonProperty("full_name")
    private String fullName;

    @JsonProperty("function_summary")
    private String functionSummary;
}