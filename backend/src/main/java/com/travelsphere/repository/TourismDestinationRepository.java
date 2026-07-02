package com.travelsphere.repository;

import com.travelsphere.model.TourismDestination;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * MongoDB repository for {@link TourismDestination} documents.
 *
 * <p>Spring Data MongoDB automatically provides CRUD implementations
 * at runtime. Custom finder methods are derived from their names.</p>
 */
@Repository
public interface TourismDestinationRepository extends MongoRepository<TourismDestination, String> {

    /** Returns only destinations currently marked as active. */
    List<TourismDestination> findByActiveTrue();

    /**
     * Returns destinations whose budget window overlaps the user's budget.
     * i.e.  minBudgetUsd <= userBudget  AND  maxBudgetUsd >= userBudget
     */
    List<TourismDestination> findByMinBudgetUsdLessThanEqualAndMaxBudgetUsdGreaterThanEqualAndActiveTrue(
            double maxBudget, double minBudget);

    /** Returns destinations that contain at least one of the supplied travel-style tags. */
    List<TourismDestination> findByTravelStylesInAndActiveTrue(List<String> travelStyles);

    /** Finds destinations by country code (case-sensitive). */
    List<TourismDestination> findByCountryCodeAndActiveTrue(String countryCode);
}
