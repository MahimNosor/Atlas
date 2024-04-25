package team.bham.service;

import java.util.*;
import java.util.stream.Collectors;
import javax.persistence.EntityManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import team.bham.domain.AppUser;
import team.bham.domain.Route;
import team.bham.domain.Tag;
import team.bham.repository.AppUserRepository;
import team.bham.repository.RouteRepository;

/**
 * Service Implementation for managing {@link Route}.
 */
@Service
@Transactional
public class RouteService {

    private final Logger log = LoggerFactory.getLogger(RouteService.class);

    private final RouteRepository routeRepository;
    private final AppUserRepository appUserRepository;

    public RouteService(RouteRepository routeRepository, AppUserRepository appUserRepository) {
        this.routeRepository = routeRepository;
        this.appUserRepository = appUserRepository;
    }

    /**
     * Save a route.
     *
     * @param route the entity to save.
     * @return the persisted entity.
     */
    public Route save(Route route) {
        log.debug("Request to save Route : {}", route);
        appUserRepository.updateNumRoutes(route.getAppUser().getId());
        return routeRepository.save(route);
    }

    /**
     * Update a route.
     *
     * @param route the entity to save.
     * @return the persisted entity.
     */
    public Route update(Route route) {
        log.debug("Request to update Route : {}", route);
        return routeRepository.save(route);
    }

    /**
     * Partially update a route.
     *
     * @param route the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Route> partialUpdate(Route route) {
        log.debug("Request to partially update Route : {}", route);

        return routeRepository
            .findById(route.getId())
            .map(existingRoute -> {
                if (route.getTitle() != null) {
                    existingRoute.setTitle(route.getTitle());
                }
                if (route.getDescription() != null) {
                    existingRoute.setDescription(route.getDescription());
                }
                if (route.getRating() != null) {
                    existingRoute.setRating(route.getRating());
                }
                if (route.getDistance() != null) {
                    existingRoute.setDistance(route.getDistance());
                }
                if (route.getCost() != null) {
                    existingRoute.setCost(route.getCost());
                }
                if (route.getNumReviews() != null) {
                    existingRoute.setNumReviews(route.getNumReviews());
                }

                return existingRoute;
            })
            .map(routeRepository::save);
    }

    /**
     * Get all the routes.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Route> findAll(Pageable pageable) {
        log.debug("Request to get all Routes");
        return routeRepository.findAll(pageable);
    }

    /**
     * Get all the routes with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<Route> findAllWithEagerRelationships(Pageable pageable) {
        return routeRepository.findAllWithEagerRelationships(pageable);
    }

    /**
     * Get one route by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Route> findOne(Long id) {
        log.debug("Request to get Route : {}", id);
        return routeRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the route by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Route : {}", id);
        routeRepository.deleteById(id);
    }

    public List<Route> findPreviousRoutesByUserId(Long userId) {
        return routeRepository.findByAppUserId(userId);
    }

    public List<Route> findRoutesByCityAndCriteria(Long cityId, Double price, Double distance, List<Long> tagIds) {
        // Fetch routes based on the provided cityId
        List<Route> routes = routeRepository.findByCityId(cityId);

        // Calculate maximum price and distance for normalization
        double maxPrice = getMaxPrice(routes);
        double maxDistance = getMaxDistance(routes);
        int maxPossibleTags = tagIds.size();

        // Create a map to store route scores
        Map<Route, Double> routeScores = new HashMap<>();

        // Calculate scores for each route
        for (Route route : routes) {
            double priceScore = (maxPrice - route.getCost()) / maxPrice;
            double distanceScore = (maxDistance - route.getDistance()) / maxDistance;
            double tagsScore = calculateTagsScore(route, tagIds);

            // Calculate overall score using weights
            double overallScore = (2 * priceScore) + distanceScore + (tagsScore / 3);

            // Store the score in the map
            routeScores.put(route, overallScore);
        }

        // Sort routes by score in descending order
        List<Route> rankedRoutes = routeScores
            .entrySet()
            .stream()
            .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());

        return rankedRoutes;
    }

    // Helper method to calculate the tags score for a route
    private double calculateTagsScore(Route route, List<Long> tagIds) {
        int matchedTags = 0;
        Set<Long> routeTagIds = route.getTags().stream().map(Tag::getId).collect(Collectors.toSet());

        for (Long tagId : tagIds) {
            if (routeTagIds.contains(tagId)) {
                matchedTags++;
            }
        }

        return matchedTags;
    }

    // Helper method to get the maximum price among routes
    private double getMaxPrice(List<Route> routes) {
        return routes.stream().mapToDouble(Route::getCost).max().orElse(0);
    }

    // Helper method to get the maximum distance among routes
    private double getMaxDistance(List<Route> routes) {
        return routes.stream().mapToDouble(Route::getDistance).max().orElse(0);
    }
}
