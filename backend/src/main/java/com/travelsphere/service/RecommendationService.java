package com.travelsphere.service;

import com.travelsphere.dto.RecommendationRequest;
import com.travelsphere.dto.RecommendationResult;
import com.travelsphere.model.TourismDestination;
import com.travelsphere.repository.TourismDestinationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Rule-based travel recommendation engine.
 *
 * <h2>Scoring Algorithm</h2>
 * Each active destination receives a composite priority score out of 100:
 *
 * <pre>
 *  ┌─────────────────────────────────────────────────────┬───────────┐
 *  │ Rule                                                │ Max score │
 *  ├─────────────────────────────────────────────────────┼───────────┤
 *  │ Budget fit                                          │    40 pts │
 *  │   - Destination fits within user budget exactly     │    40     │
 *  │   - User budget ≥ minBudget but < maxBudget         │    25     │
 *  │   - User budget < minBudget (under budget)          │     0     │
 *  ├─────────────────────────────────────────────────────┼───────────┤
 *  │ Travel-style match                                  │    40 pts │
 *  │   - Each matching tag contributes proportionally    │           │
 *  │     (40 / totalRequestedStyles * matchedStyles)     │           │
 *  ├─────────────────────────────────────────────────────┼───────────┤
 *  │ Climate preference                                  │    10 pts │
 *  │   - Exact match with requested climateType          │    10     │
 *  │   - No preference specified                         │    10     │
 *  ├─────────────────────────────────────────────────────┼───────────┤
 *  │ Safety rating                                       │    10 pts │
 *  │   - Scaled linearly from 0 to 10 based on rating    │           │
 *  └─────────────────────────────────────────────────────┴───────────┘
 * </pre>
 *
 * Destinations below the {@code minSafetyRating} threshold are excluded entirely.
 * Results are sorted descending by score, then limited to {@code request.limit}.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final TourismDestinationRepository destinationRepository;

    /**
     * Returns a ranked list of travel destinations that best match the user profile.
     *
     * @param request user's budget + preference profile
     * @return sorted list of scored {@link RecommendationResult}s
     */
    public List<RecommendationResult> recommend(RecommendationRequest request) {
        log.info("Generating recommendations – budget=${}, styles={}",
                request.getBudgetUsd(), request.getTravelStyles());

        List<TourismDestination> candidates = destinationRepository.findByActiveTrue();

        return candidates.stream()
                .filter(d -> d.getSafetyRating() >= request.getMinSafetyRating())
                .map(d -> score(d, request))
                .filter(r -> r.getPriorityScore() > 0)
                .sorted(Comparator.comparingDouble(RecommendationResult::getPriorityScore).reversed())
                .limit(request.getLimit())
                .collect(Collectors.toList());
    }

    // ─── Private scoring logic ───────────────────────────────────────────────────

    private RecommendationResult score(TourismDestination dest, RecommendationRequest req) {
        double total = budgetScore(dest, req)
                     + styleScore(dest, req)
                     + climateScore(dest, req)
                     + safetyScore(dest);

        return RecommendationResult.builder()
                .destinationId(dest.getId())
                .name(dest.getName())
                .countryCode(dest.getCountryCode())
                .description(dest.getDescription())
                .imageUrl(dest.getImageUrl())
                .priorityScore(Math.min(total, 100.0))
                .minBudgetUsd(dest.getMinBudgetUsd())
                .maxBudgetUsd(dest.getMaxBudgetUsd())
                .avgDurationDays(dest.getAvgDurationDays())
                .build();
    }

    /**
     * Budget fit score (max 40 pts).
     *
     * <ul>
     *   <li>40 pts — user budget sits within [min, max] range</li>
     *   <li>25 pts — user budget ≥ min but exceeds max (can afford, might overshoot)</li>
     *   <li> 0 pts — user budget is below minimum (cannot afford)</li>
     * </ul>
     */
    private double budgetScore(TourismDestination dest, RecommendationRequest req) {
        double budget = req.getBudgetUsd();
        if (budget >= dest.getMinBudgetUsd() && budget <= dest.getMaxBudgetUsd()) {
            return 40.0;
        } else if (budget > dest.getMaxBudgetUsd()) {
            return 25.0;
        }
        // budget < minBudgetUsd
        return 0.0;
    }

    /**
     * Travel-style match score (max 40 pts).
     *
     * <p>Proportional: each matched tag contributes 40 / total-requested-styles points.</p>
     */
    private double styleScore(TourismDestination dest, RecommendationRequest req) {
        if (req.getTravelStyles() == null || req.getTravelStyles().isEmpty()) {
            return 0.0;
        }
        long matched = req.getTravelStyles().stream()
                .filter(s -> dest.getTravelStyles() != null &&
                             dest.getTravelStyles().contains(s.toLowerCase()))
                .count();

        return (40.0 / req.getTravelStyles().size()) * matched;
    }

    /**
     * Climate preference score (max 10 pts).
     *
     * <ul>
     *   <li>10 pts — exact climate match, or no climate preference specified</li>
     *   <li> 0 pts — climate mismatch</li>
     * </ul>
     */
    private double climateScore(TourismDestination dest, RecommendationRequest req) {
        if (req.getClimateType() == null || req.getClimateType().isBlank()) {
            return 10.0; // No preference → full climate score
        }
        return req.getClimateType().equalsIgnoreCase(dest.getClimateType()) ? 10.0 : 0.0;
    }

    /**
     * Safety rating score (max 10 pts).
     *
     * <p>Linearly scaled: {@code safetyRating / 10 * 10}.</p>
     */
    private double safetyScore(TourismDestination dest) {
        return Math.max(0, Math.min(dest.getSafetyRating(), 10)) * 1.0;
    }
}
