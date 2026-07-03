package com.travelsphere.config;

import com.travelsphere.model.TourismDestination;
import com.travelsphere.repository.TourismDestinationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Startup data seeder for the {@code tourism_destinations} MongoDB collection.
 *
 * <p>Runs automatically after the Spring context is fully initialised.
 * If the collection is <strong>empty</strong>, it inserts 5 diverse dummy
 * destinations covering adventure, luxury, cultural, budget, and nature
 * travel styles with a range of budgets, climates, and safety ratings.</p>
 *
 * <p>If the collection already contains data the seeder does nothing,
 * making it safe to leave enabled in all environments.</p>
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements ApplicationRunner {

    private final TourismDestinationRepository destinationRepository;

    @Override
    public void run(ApplicationArguments args) {
        try {
            if (destinationRepository.count() > 0) {
                log.info("DataSeeder – collection already populated. Skipping seed.");
                return;
            }
            log.info("DataSeeder – collection is empty. Inserting 5 seed destinations…");
            destinationRepository.saveAll(buildSeedData());
            log.info("DataSeeder – seed complete. {} destinations inserted.",
                    destinationRepository.count());
        } catch (Exception e) {
            // Never crash the whole application just because the seed check failed.
            // This can happen if MongoDB is temporarily unreachable at startup
            // (e.g. inside a Docker container before the network is fully ready).
            // The app will still start and the seed will be retried on next restart.
            log.warn("DataSeeder – could not reach MongoDB at startup. Seed skipped. " +
                     "Cause: {}", e.getMessage());
        }
    }

    // ─── Seed data ────────────────────────────────────────────────────────────

    private List<TourismDestination> buildSeedData() {
        return List.of(

            // 1. Adventure ────────────────────────────────────────────────────
            TourismDestination.builder()
                .name("Patagonia, Argentina")
                .countryCode("AR")
                .description(
                    "Raw, breathtaking wilderness at the southern tip of South America. " +
                    "Home to the iconic Torres del Paine, Perito Moreno Glacier, and endless " +
                    "trekking trails through pristine Andean landscapes.")
                .travelStyles(List.of("adventure", "nature"))
                .minBudgetUsd(1_500)
                .maxBudgetUsd(4_000)
                .avgDurationDays(14)
                .climateType("temperate")
                .safetyRating(7)
                .imageUrl("https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80")
                .active(true)
                .build(),

            // 2. Luxury beach resort ──────────────────────────────────────────
            TourismDestination.builder()
                .name("Maldives")
                .countryCode("MV")
                .description(
                    "Ultra-luxury overwater bungalows set above crystal-clear lagoons in " +
                    "the Indian Ocean. World-class diving, spa retreats, and gourmet dining " +
                    "make this the definitive luxury beach escape.")
                .travelStyles(List.of("luxury", "beach"))
                .minBudgetUsd(3_000)
                .maxBudgetUsd(10_000)
                .avgDurationDays(7)
                .climateType("tropical")
                .safetyRating(9)
                .imageUrl("https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80")
                .active(true)
                .build(),

            // 3. Cultural city tour ────────────────────────────────────────────
            TourismDestination.builder()
                .name("Kyoto, Japan")
                .countryCode("JP")
                .description(
                    "Japan's ancient imperial capital, filled with over 1,600 Buddhist " +
                    "temples, traditional machiya townhouses, and serene Zen gardens. " +
                    "Visit during cherry-blossom season for an unforgettable experience.")
                .travelStyles(List.of("cultural", "city"))
                .minBudgetUsd(1_800)
                .maxBudgetUsd(5_000)
                .avgDurationDays(9)
                .climateType("temperate")
                .safetyRating(10)
                .imageUrl("https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80")
                .active(true)
                .build(),

            // 4. Budget-friendly cultural ─────────────────────────────────────
            TourismDestination.builder()
                .name("Marrakech, Morocco")
                .countryCode("MA")
                .description(
                    "A sensory feast of vibrant souks, ancient medinas, fragrant spice " +
                    "markets, and majestic riads. Marrakech blends Berber, Arab, and French " +
                    "influences into one of Africa's most captivating cities.")
                .travelStyles(List.of("cultural", "budget", "adventure"))
                .minBudgetUsd(600)
                .maxBudgetUsd(1_800)
                .avgDurationDays(7)
                .climateType("arid")
                .safetyRating(7)
                .imageUrl("https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&q=80")
                .active(true)
                .build(),

            // 5. Nature + polar ────────────────────────────────────────────────
            TourismDestination.builder()
                .name("Iceland")
                .countryCode("IS")
                .description(
                    "The land of fire and ice: witness the Northern Lights dancing over " +
                    "volcanic landscapes, soak in geothermal hot springs, hike across " +
                    "glaciers, and marvel at dramatic waterfalls and geysers.")
                .travelStyles(List.of("adventure", "nature"))
                .minBudgetUsd(2_500)
                .maxBudgetUsd(7_000)
                .avgDurationDays(8)
                .climateType("polar")
                .safetyRating(10)
                .imageUrl("https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=600&q=80")
                .active(true)
                .build()
        );
    }
}
