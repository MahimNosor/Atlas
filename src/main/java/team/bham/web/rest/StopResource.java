package team.bham.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import team.bham.domain.Stop;
import team.bham.repository.StopRepository;
import team.bham.service.StopService;
import team.bham.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link team.bham.domain.Stop}.
 */
@RestController
@RequestMapping("/api")
public class StopResource {

    private final Logger log = LoggerFactory.getLogger(StopResource.class);

    private static final String ENTITY_NAME = "stop";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final StopService stopService;

    private final StopRepository stopRepository;

    public StopResource(StopService stopService, StopRepository stopRepository) {
        this.stopService = stopService;
        this.stopRepository = stopRepository;
    }

    /**
     * {@code POST  /stops} : Create a new stop.
     *
     * @param stop the stop to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new stop, or with status {@code 400 (Bad Request)} if the stop has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/stops")
    public ResponseEntity<Stop> createStop(@Valid @RequestBody Stop stop) throws URISyntaxException {
        log.debug("REST request to save Stop : {}", stop);
        if (stop.getId() != null) {
            throw new BadRequestAlertException("A new stop cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Stop result = stopService.save(stop);
        return ResponseEntity
            .created(new URI("/api/stops/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /stops/:id} : Updates an existing stop.
     *
     * @param id the id of the stop to save.
     * @param stop the stop to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated stop,
     * or with status {@code 400 (Bad Request)} if the stop is not valid,
     * or with status {@code 500 (Internal Server Error)} if the stop couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/stops/{id}")
    public ResponseEntity<Stop> updateStop(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Stop stop)
        throws URISyntaxException {
        log.debug("REST request to update Stop : {}, {}", id, stop);
        if (stop.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, stop.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!stopRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Stop result = stopService.update(stop);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, stop.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /stops/:id} : Partial updates given fields of an existing stop, field will ignore if it is null
     *
     * @param id the id of the stop to save.
     * @param stop the stop to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated stop,
     * or with status {@code 400 (Bad Request)} if the stop is not valid,
     * or with status {@code 404 (Not Found)} if the stop is not found,
     * or with status {@code 500 (Internal Server Error)} if the stop couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/stops/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Stop> partialUpdateStop(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Stop stop
    ) throws URISyntaxException {
        log.debug("REST request to partial update Stop partially : {}, {}", id, stop);
        if (stop.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, stop.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!stopRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Stop> result = stopService.partialUpdate(stop);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, stop.getId().toString())
        );
    }

    /**
     * {@code GET  /stops} : get all the stops.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of stops in body.
     */
    @GetMapping("/stops")
    public ResponseEntity<List<Stop>> getAllStops(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Stops");
        Page<Stop> page = stopService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /stops/:id} : get the "id" stop.
     *
     * @param id the id of the stop to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the stop, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/stops/{id}")
    public ResponseEntity<Stop> getStop(@PathVariable Long id) {
        log.debug("REST request to get Stop : {}", id);
        Optional<Stop> stop = stopService.findOne(id);
        return ResponseUtil.wrapOrNotFound(stop);
    }

    /**
     * {@code DELETE  /stops/:id} : delete the "id" stop.
     *
     * @param id the id of the stop to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/stops/{id}")
    public ResponseEntity<Void> deleteStop(@PathVariable Long id) {
        log.debug("REST request to delete Stop : {}", id);
        stopService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
