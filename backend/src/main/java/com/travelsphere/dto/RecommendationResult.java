package com.travelsphere.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A single scored destination returned by the recommendation engine.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationResult {

    /** MongoDB document id of the destination. */
    private String destinationId;

    /** Human-readable name. */
    private String name;

    /** Country code (ISO 3166-1 alpha-2). */
    private String countryCode;

    /** Short marketing description. */
    private String description;

    /** Image URL. */
    private String imageUrl;

    /**
     * Composite priority score in the range [0, 100].
     *
     * <p>Score breakdown:</p>
     * <ul>
     *   <li>Budget fit          → up to 40 pts</li>
     *   <li>Travel-style match  → up to 40 pts</li>
     *   <li>Climate preference  → up to 10 pts</li>
     *   <li>Safety rating       → up to 10 pts</li>
     * </ul>
     */
    private double priorityScore;

    /** Recommended minimum budget for this destination. */
    private double minBudgetUsd;

    /** Recommended maximum budget for this destination. */
    private double maxBudgetUsd;

    /** Average trip duration in days. */
    private int avgDurationDays;
}
