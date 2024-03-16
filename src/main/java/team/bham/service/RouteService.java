package team.bham.service;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import team.bham.domain.Route;
import team.bham.repository.RouteRepository;

/**
 * Service Implementation for managing {@link Route}.
 */
@Service
@Transactional
public class RouteService {

    private final Logger log = LoggerFactory.getLogger(RouteService.class);

    private final RouteRepository routeRepository;

    public RouteService(RouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }

    /**
     * Save a route.
     *
     * @param route the entity to save.
     * @return the persisted entity.
     */
    public Route save(Route route) {
        log.debug("Request to save Route : {}", route);
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
}
