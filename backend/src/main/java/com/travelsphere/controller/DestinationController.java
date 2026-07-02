package com.travelsphere.controller;

import com.travelsphere.model.TourismDestination;
import com.travelsphere.repository.TourismDestinationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for managing tourism destination data.
 *
 * <pre>
 *   GET    /api/destinations        – List all active destinations (public)
 *   GET    /api/destinations/{id}   – Get a single destination by id (public)
 *   POST   /api/destinations        – Create a destination (ADMIN only)
 *   PUT    /api/destinations/{id}   – Update a destination (ADMIN only)
 *   DELETE /api/destinations/{id}   – Delete a destination (ADMIN only)
 * </pre>
 */
@RestController
@RequestMapping("/api/destinations")
@RequiredArgsConstructor
public class DestinationController {

    private final TourismDestinationRepository destinationRepository;

    @GetMapping
    public ResponseEntity<List<TourismDestination>> getAll() {
        return ResponseEntity.ok(destinationRepository.findByActiveTrue());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TourismDestination> getById(@PathVariable String id) {
        return destinationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<TourismDestination> create(
            @RequestBody TourismDestination destination) {
        destination.setActive(true);
        TourismDestination saved = destinationRepository.save(destination);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<TourismDestination> update(
            @PathVariable String id,
            @RequestBody TourismDestination updated) {

        return destinationRepository.findById(id)
                .map(existing -> {
                    updated.setId(existing.getId());
                    return ResponseEntity.ok(destinationRepository.save(updated));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (!destinationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        destinationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
