package com.travelsphere.controller;

import com.travelsphere.dto.RecommendationRequest;
import com.travelsphere.dto.RecommendationResult;
import com.travelsphere.service.RecommendationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for travel recommendation endpoints.
 *
 * <p>Requires a valid JWT (any authenticated user).
 * Admin-only management routes are also provided.</p>
 *
 * <pre>
 *   POST /api/recommendations           – Get personalised recommendations
 *   GET  /api/recommendations/health    – Liveness check
 * </pre>
 */
@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    /**
     * Returns a priority-scored list of travel destinations that best match
     * the authenticated user's budget and travel-style profile.
     *
     * <p>Requires: {@code Authorization: Bearer <token>}</p>
     *
     * <p><b>Example request body:</b></p>
     * <pre>{@code
     * {
     *   "budgetUsd": 2000,
     *   "travelStyles": ["adventure", "nature"],
     *   "climateType": "tropical",
     *   "minSafetyRating": 6,
     *   "limit": 5
     * }
     * }</pre>
     *
     * @param request validated recommendation preferences
     * @return 200 OK + list of {@link RecommendationResult} sorted by priority score desc
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<RecommendationResult>> recommend(
            @Valid @RequestBody RecommendationRequest request) {

        List<RecommendationResult> results = recommendationService.recommend(request);
        return ResponseEntity.ok(results);
    }

    /**
     * Health-check for the recommendation service.
     *
     * @return 200 OK + status message
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "TravelSphere Recommendation Engine"
        ));
    }
}
