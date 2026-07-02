package com.travelsphere.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

/**
 * Payload for POST /api/recommendations.
 *
 * <p>The recommendation engine uses {@code budgetUsd} and {@code travelStyles}
 * to calculate priority scores for each active destination.</p>
 */
@Data
public class RecommendationRequest {

    /**
     * User's total trip budget in USD per person.
     * Must be a positive value.
     */
    @NotNull(message = "Budget is required")
    @Min(value = 1, message = "Budget must be at least $1")
    private Double budgetUsd;

    /**
     * One or more preferred travel styles.
     * Accepted values: adventure, luxury, budget, cultural, nature, beach, city
     */
    @NotEmpty(message = "At least one travel style is required")
    private List<String> travelStyles;

    /**
     * Preferred climate type (optional).
     * Accepted values: tropical, temperate, arid, polar
     */
    private String climateType;

    /**
     * Minimum acceptable safety rating (1–10, optional).
     * Defaults to 0 if omitted.
     */
    private int minSafetyRating;

    /**
     * Maximum number of results to return.
     * Defaults to 10.
     */
    private int limit = 10;
}
