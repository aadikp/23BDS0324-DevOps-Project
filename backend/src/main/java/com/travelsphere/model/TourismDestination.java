package com.travelsphere.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

/**
 * Represents a travel destination stored in MongoDB.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tourism_destinations")
public class TourismDestination {

    @Id
    private String id;

    /** Human-readable name of the destination (e.g. "Bali, Indonesia"). */
    private String name;

    /** ISO 3166-1 alpha-2 country code. */
    private String countryCode;

    /** Short marketing description. */
    private String description;

    /** Comma-separated tags describing travel style (adventure, luxury, budget, etc.). */
    private List<String> travelStyles;

    /** Minimum recommended budget per person in USD. */
    private double minBudgetUsd;

    /** Maximum recommended budget per person in USD. */
    private double maxBudgetUsd;

    /** Average trip duration in days. */
    private int avgDurationDays;

    /** Primary climate type (tropical, temperate, arid, polar). */
    private String climateType;

    /** Safety rating on a 1–10 scale. */
    private int safetyRating;

    /** Image URL for the destination thumbnail. */
    private String imageUrl;

    /** Whether the destination is currently active / visible. */
    private boolean active;
}
