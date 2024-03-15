package team.bham.service;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import team.bham.domain.Stop;
import team.bham.repository.StopRepository;

/**
 * Service Implementation for managing {@link Stop}.
 */
@Service
@Transactional
public class StopService {

    private final Logger log = LoggerFactory.getLogger(StopService.class);

    private final StopRepository stopRepository;

    public StopService(StopRepository stopRepository) {
        this.stopRepository = stopRepository;
    }

    /**
     * Save a stop.
     *
     * @param stop the entity to save.
     * @return the persisted entity.
     */
    public Stop save(Stop stop) {
        log.debug("Request to save Stop : {}", stop);
        return stopRepository.save(stop);
    }

    /**
     * Update a stop.
     *
     * @param stop the entity to save.
     * @return the persisted entity.
     */
    public Stop update(Stop stop) {
        log.debug("Request to update Stop : {}", stop);
        return stopRepository.save(stop);
    }

    /**
     * Partially update a stop.
     *
     * @param stop the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Stop> partialUpdate(Stop stop) {
        log.debug("Request to partially update Stop : {}", stop);

        return stopRepository
            .findById(stop.getId())
            .map(existingStop -> {
                if (stop.getName() != null) {
                    existingStop.setName(stop.getName());
                }
                if (stop.getDescription() != null) {
                    existingStop.setDescription(stop.getDescription());
                }
                if (stop.getLatitude() != null) {
                    existingStop.setLatitude(stop.getLatitude());
                }
                if (stop.getLongitude() != null) {
                    existingStop.setLongitude(stop.getLongitude());
                }
                if (stop.getSequenceNumber() != null) {
                    existingStop.setSequenceNumber(stop.getSequenceNumber());
                }

                return existingStop;
            })
            .map(stopRepository::save);
    }

    /**
     * Get all the stops.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Stop> findAll(Pageable pageable) {
        log.debug("Request to get all Stops");
        return stopRepository.findAll(pageable);
    }

    /**
     * Get one stop by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Stop> findOne(Long id) {
        log.debug("Request to get Stop : {}", id);
        return stopRepository.findById(id);
    }

    /**
     * Delete the stop by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Stop : {}", id);
        stopRepository.deleteById(id);
    }
}
