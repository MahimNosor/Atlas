package team.bham.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import team.bham.IntegrationTest;
import team.bham.domain.Stop;
import team.bham.repository.StopRepository;

/**
 * Integration tests for the {@link StopResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class StopResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Double DEFAULT_LATITUDE = 1D;
    private static final Double UPDATED_LATITUDE = 2D;

    private static final Double DEFAULT_LONGITUDE = 1D;
    private static final Double UPDATED_LONGITUDE = 2D;

    private static final Integer DEFAULT_SEQUENCE_NUMBER = 1;
    private static final Integer UPDATED_SEQUENCE_NUMBER = 2;

    private static final Integer DEFAULT_RATING = 1;
    private static final Integer UPDATED_RATING = 2;

    private static final String ENTITY_API_URL = "/api/stops";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private StopRepository stopRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restStopMockMvc;

    private Stop stop;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Stop createEntity(EntityManager em) {
        Stop stop = new Stop()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .latitude(DEFAULT_LATITUDE)
            .longitude(DEFAULT_LONGITUDE)
            .sequenceNumber(DEFAULT_SEQUENCE_NUMBER)
            .rating(DEFAULT_RATING);
        return stop;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Stop createUpdatedEntity(EntityManager em) {
        Stop stop = new Stop()
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .latitude(UPDATED_LATITUDE)
            .longitude(UPDATED_LONGITUDE)
            .sequenceNumber(UPDATED_SEQUENCE_NUMBER)
            .rating(UPDATED_RATING);
        return stop;
    }

    @BeforeEach
    public void initTest() {
        stop = createEntity(em);
    }

    @Test
    @Transactional
    void createStop() throws Exception {
        int databaseSizeBeforeCreate = stopRepository.findAll().size();
        // Create the Stop
        restStopMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(stop)))
            .andExpect(status().isCreated());

        // Validate the Stop in the database
        List<Stop> stopList = stopRepository.findAll();
        assertThat(stopList).hasSize(databaseSizeBeforeCreate + 1);
        Stop testStop = stopList.get(stopList.size() - 1);
        assertThat(testStop.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testStop.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testStop.getLatitude()).isEqualTo(DEFAULT_LATITUDE);
        assertThat(testStop.getLongitude()).isEqualTo(DEFAULT_LONGITUDE);
        assertThat(testStop.getSequenceNumber()).isEqualTo(DEFAULT_SEQUENCE_NUMBER);
        assertThat(testStop.getRating()).isEqualTo(DEFAULT_RATING);
    }

    @Test
    @Transactional
    void createStopWithExistingId() throws Exception {
        // Create the Stop with an existing ID
        stop.setId(1L);

        int databaseSizeBeforeCreate = stopRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restStopMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(stop)))
            .andExpect(status().isBadRequest());

        // Validate the Stop in the database
        List<Stop> stopList = stopRepository.findAll();
        assertThat(stopList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = stopRepository.findAll().size();
        // set the field null
        stop.setName(null);

        // Create the Stop, which fails.

        restStopMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(stop)))
            .andExpect(status().isBadRequest());

        List<Stop> stopList = stopRepository.findAll();
        assertThat(stopList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllStops() throws Exception {
        // Initialize the database
        stopRepository.saveAndFlush(stop);

        // Get all the stopList
        restStopMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(stop.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].latitude").value(hasItem(DEFAULT_LATITUDE.doubleValue())))
            .andExpect(jsonPath("$.[*].longitude").value(hasItem(DEFAULT_LONGITUDE.doubleValue())))
            .andExpect(jsonPath("$.[*].sequenceNumber").value(hasItem(DEFAULT_SEQUENCE_NUMBER)))
            .andExpect(jsonPath("$.[*].rating").value(hasItem(DEFAULT_RATING)));
    }

    @Test
    @Transactional
    void getStop() throws Exception {
        // Initialize the database
        stopRepository.saveAndFlush(stop);

        // Get the stop
        restStopMockMvc
            .perform(get(ENTITY_API_URL_ID, stop.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(stop.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.latitude").value(DEFAULT_LATITUDE.doubleValue()))
            .andExpect(jsonPath("$.longitude").value(DEFAULT_LONGITUDE.doubleValue()))
            .andExpect(jsonPath("$.sequenceNumber").value(DEFAULT_SEQUENCE_NUMBER))
            .andExpect(jsonPath("$.rating").value(DEFAULT_RATING));
    }

    @Test
    @Transactional
    void getNonExistingStop() throws Exception {
        // Get the stop
        restStopMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingStop() throws Exception {
        // Initialize the database
        stopRepository.saveAndFlush(stop);

        int databaseSizeBeforeUpdate = stopRepository.findAll().size();

        // Update the stop
        Stop updatedStop = stopRepository.findById(stop.getId()).get();
        // Disconnect from session so that the updates on updatedStop are not directly saved in db
        em.detach(updatedStop);
        updatedStop
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .latitude(UPDATED_LATITUDE)
            .longitude(UPDATED_LONGITUDE)
            .sequenceNumber(UPDATED_SEQUENCE_NUMBER)
            .rating(UPDATED_RATING);

        restStopMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedStop.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedStop))
            )
            .andExpect(status().isOk());

        // Validate the Stop in the database
        List<Stop> stopList = stopRepository.findAll();
        assertThat(stopList).hasSize(databaseSizeBeforeUpdate);
        Stop testStop = stopList.get(stopList.size() - 1);
        assertThat(testStop.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testStop.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testStop.getLatitude()).isEqualTo(UPDATED_LATITUDE);
        assertThat(testStop.getLongitude()).isEqualTo(UPDATED_LONGITUDE);
        assertThat(testStop.getSequenceNumber()).isEqualTo(UPDATED_SEQUENCE_NUMBER);
        assertThat(testStop.getRating()).isEqualTo(UPDATED_RATING);
    }

    @Test
    @Transactional
    void putNonExistingStop() throws Exception {
        int databaseSizeBeforeUpdate = stopRepository.findAll().size();
        stop.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStopMockMvc
            .perform(
                put(ENTITY_API_URL_ID, stop.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(stop))
            )
            .andExpect(status().isBadRequest());

        // Validate the Stop in the database
        List<Stop> stopList = stopRepository.findAll();
        assertThat(stopList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchStop() throws Exception {
        int databaseSizeBeforeUpdate = stopRepository.findAll().size();
        stop.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStopMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(stop))
            )
            .andExpect(status().isBadRequest());

        // Validate the Stop in the database
        List<Stop> stopList = stopRepository.findAll();
        assertThat(stopList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamStop() throws Exception {
        int databaseSizeBeforeUpdate = stopRepository.findAll().size();
        stop.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStopMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(stop)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Stop in the database
        List<Stop> stopList = stopRepository.findAll();
        assertThat(stopList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateStopWithPatch() throws Exception {
        // Initialize the database
        stopRepository.saveAndFlush(stop);

        int databaseSizeBeforeUpdate = stopRepository.findAll().size();

        // Update the stop using partial update
        Stop partialUpdatedStop = new Stop();
        partialUpdatedStop.setId(stop.getId());

        partialUpdatedStop.description(UPDATED_DESCRIPTION).sequenceNumber(UPDATED_SEQUENCE_NUMBER).rating(UPDATED_RATING);

        restStopMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStop.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStop))
            )
            .andExpect(status().isOk());

        // Validate the Stop in the database
        List<Stop> stopList = stopRepository.findAll();
        assertThat(stopList).hasSize(databaseSizeBeforeUpdate);
        Stop testStop = stopList.get(stopList.size() - 1);
        assertThat(testStop.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testStop.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testStop.getLatitude()).isEqualTo(DEFAULT_LATITUDE);
        assertThat(testStop.getLongitude()).isEqualTo(DEFAULT_LONGITUDE);
        assertThat(testStop.getSequenceNumber()).isEqualTo(UPDATED_SEQUENCE_NUMBER);
        assertThat(testStop.getRating()).isEqualTo(UPDATED_RATING);
    }

    @Test
    @Transactional
    void fullUpdateStopWithPatch() throws Exception {
        // Initialize the database
        stopRepository.saveAndFlush(stop);

        int databaseSizeBeforeUpdate = stopRepository.findAll().size();

        // Update the stop using partial update
        Stop partialUpdatedStop = new Stop();
        partialUpdatedStop.setId(stop.getId());

        partialUpdatedStop
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .latitude(UPDATED_LATITUDE)
            .longitude(UPDATED_LONGITUDE)
            .sequenceNumber(UPDATED_SEQUENCE_NUMBER)
            .rating(UPDATED_RATING);

        restStopMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStop.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStop))
            )
            .andExpect(status().isOk());

        // Validate the Stop in the database
        List<Stop> stopList = stopRepository.findAll();
        assertThat(stopList).hasSize(databaseSizeBeforeUpdate);
        Stop testStop = stopList.get(stopList.size() - 1);
        assertThat(testStop.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testStop.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testStop.getLatitude()).isEqualTo(UPDATED_LATITUDE);
        assertThat(testStop.getLongitude()).isEqualTo(UPDATED_LONGITUDE);
        assertThat(testStop.getSequenceNumber()).isEqualTo(UPDATED_SEQUENCE_NUMBER);
        assertThat(testStop.getRating()).isEqualTo(UPDATED_RATING);
    }

    @Test
    @Transactional
    void patchNonExistingStop() throws Exception {
        int databaseSizeBeforeUpdate = stopRepository.findAll().size();
        stop.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStopMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, stop.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(stop))
            )
            .andExpect(status().isBadRequest());

        // Validate the Stop in the database
        List<Stop> stopList = stopRepository.findAll();
        assertThat(stopList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchStop() throws Exception {
        int databaseSizeBeforeUpdate = stopRepository.findAll().size();
        stop.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStopMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(stop))
            )
            .andExpect(status().isBadRequest());

        // Validate the Stop in the database
        List<Stop> stopList = stopRepository.findAll();
        assertThat(stopList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamStop() throws Exception {
        int databaseSizeBeforeUpdate = stopRepository.findAll().size();
        stop.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStopMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(stop)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Stop in the database
        List<Stop> stopList = stopRepository.findAll();
        assertThat(stopList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteStop() throws Exception {
        // Initialize the database
        stopRepository.saveAndFlush(stop);

        int databaseSizeBeforeDelete = stopRepository.findAll().size();

        // Delete the stop
        restStopMockMvc
            .perform(delete(ENTITY_API_URL_ID, stop.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Stop> stopList = stopRepository.findAll();
        assertThat(stopList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
