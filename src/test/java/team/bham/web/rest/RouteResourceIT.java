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
import team.bham.domain.Route;
import team.bham.repository.RouteRepository;

/**
 * Integration tests for the {@link RouteResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RouteResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Integer DEFAULT_RATING = 1;
    private static final Integer UPDATED_RATING = 2;

    private static final Double DEFAULT_DISTANCE = 1D;
    private static final Double UPDATED_DISTANCE = 2D;

    private static final Double DEFAULT_COST = 1D;
    private static final Double UPDATED_COST = 2D;

    private static final Integer DEFAULT_NUM_REVIEWS = 1;
    private static final Integer UPDATED_NUM_REVIEWS = 2;

    private static final String ENTITY_API_URL = "/api/routes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRouteMockMvc;

    private Route route;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Route createEntity(EntityManager em) {
        Route route = new Route()
            .title(DEFAULT_TITLE)
            .description(DEFAULT_DESCRIPTION)
            .rating(DEFAULT_RATING)
            .distance(DEFAULT_DISTANCE)
            .cost(DEFAULT_COST)
            .numReviews(DEFAULT_NUM_REVIEWS);
        return route;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Route createUpdatedEntity(EntityManager em) {
        Route route = new Route()
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .rating(UPDATED_RATING)
            .distance(UPDATED_DISTANCE)
            .cost(UPDATED_COST)
            .numReviews(UPDATED_NUM_REVIEWS);
        return route;
    }

    @BeforeEach
    public void initTest() {
        route = createEntity(em);
    }

    @Test
    @Transactional
    void createRoute() throws Exception {
        int databaseSizeBeforeCreate = routeRepository.findAll().size();
        // Create the Route
        restRouteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(route)))
            .andExpect(status().isCreated());

        // Validate the Route in the database
        List<Route> routeList = routeRepository.findAll();
        assertThat(routeList).hasSize(databaseSizeBeforeCreate + 1);
        Route testRoute = routeList.get(routeList.size() - 1);
        assertThat(testRoute.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testRoute.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testRoute.getRating()).isEqualTo(DEFAULT_RATING);
        assertThat(testRoute.getDistance()).isEqualTo(DEFAULT_DISTANCE);
        assertThat(testRoute.getCost()).isEqualTo(DEFAULT_COST);
        assertThat(testRoute.getNumReviews()).isEqualTo(DEFAULT_NUM_REVIEWS);
    }

    @Test
    @Transactional
    void createRouteWithExistingId() throws Exception {
        // Create the Route with an existing ID
        route.setId(1L);

        int databaseSizeBeforeCreate = routeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRouteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(route)))
            .andExpect(status().isBadRequest());

        // Validate the Route in the database
        List<Route> routeList = routeRepository.findAll();
        assertThat(routeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = routeRepository.findAll().size();
        // set the field null
        route.setTitle(null);

        // Create the Route, which fails.

        restRouteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(route)))
            .andExpect(status().isBadRequest());

        List<Route> routeList = routeRepository.findAll();
        assertThat(routeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = routeRepository.findAll().size();
        // set the field null
        route.setDescription(null);

        // Create the Route, which fails.

        restRouteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(route)))
            .andExpect(status().isBadRequest());

        List<Route> routeList = routeRepository.findAll();
        assertThat(routeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkRatingIsRequired() throws Exception {
        int databaseSizeBeforeTest = routeRepository.findAll().size();
        // set the field null
        route.setRating(null);

        // Create the Route, which fails.

        restRouteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(route)))
            .andExpect(status().isBadRequest());

        List<Route> routeList = routeRepository.findAll();
        assertThat(routeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDistanceIsRequired() throws Exception {
        int databaseSizeBeforeTest = routeRepository.findAll().size();
        // set the field null
        route.setDistance(null);

        // Create the Route, which fails.

        restRouteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(route)))
            .andExpect(status().isBadRequest());

        List<Route> routeList = routeRepository.findAll();
        assertThat(routeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkNumReviewsIsRequired() throws Exception {
        int databaseSizeBeforeTest = routeRepository.findAll().size();
        // set the field null
        route.setNumReviews(null);

        // Create the Route, which fails.

        restRouteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(route)))
            .andExpect(status().isBadRequest());

        List<Route> routeList = routeRepository.findAll();
        assertThat(routeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllRoutes() throws Exception {
        // Initialize the database
        routeRepository.saveAndFlush(route);

        // Get all the routeList
        restRouteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(route.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].rating").value(hasItem(DEFAULT_RATING)))
            .andExpect(jsonPath("$.[*].distance").value(hasItem(DEFAULT_DISTANCE.doubleValue())))
            .andExpect(jsonPath("$.[*].cost").value(hasItem(DEFAULT_COST.doubleValue())))
            .andExpect(jsonPath("$.[*].numReviews").value(hasItem(DEFAULT_NUM_REVIEWS)));
    }

    @Test
    @Transactional
    void getRoute() throws Exception {
        // Initialize the database
        routeRepository.saveAndFlush(route);

        // Get the route
        restRouteMockMvc
            .perform(get(ENTITY_API_URL_ID, route.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(route.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.rating").value(DEFAULT_RATING))
            .andExpect(jsonPath("$.distance").value(DEFAULT_DISTANCE.doubleValue()))
            .andExpect(jsonPath("$.cost").value(DEFAULT_COST.doubleValue()))
            .andExpect(jsonPath("$.numReviews").value(DEFAULT_NUM_REVIEWS));
    }

    @Test
    @Transactional
    void getNonExistingRoute() throws Exception {
        // Get the route
        restRouteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingRoute() throws Exception {
        // Initialize the database
        routeRepository.saveAndFlush(route);

        int databaseSizeBeforeUpdate = routeRepository.findAll().size();

        // Update the route
        Route updatedRoute = routeRepository.findById(route.getId()).get();
        // Disconnect from session so that the updates on updatedRoute are not directly saved in db
        em.detach(updatedRoute);
        updatedRoute
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .rating(UPDATED_RATING)
            .distance(UPDATED_DISTANCE)
            .cost(UPDATED_COST)
            .numReviews(UPDATED_NUM_REVIEWS);

        restRouteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRoute.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRoute))
            )
            .andExpect(status().isOk());

        // Validate the Route in the database
        List<Route> routeList = routeRepository.findAll();
        assertThat(routeList).hasSize(databaseSizeBeforeUpdate);
        Route testRoute = routeList.get(routeList.size() - 1);
        assertThat(testRoute.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testRoute.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testRoute.getRating()).isEqualTo(UPDATED_RATING);
        assertThat(testRoute.getDistance()).isEqualTo(UPDATED_DISTANCE);
        assertThat(testRoute.getCost()).isEqualTo(UPDATED_COST);
        assertThat(testRoute.getNumReviews()).isEqualTo(UPDATED_NUM_REVIEWS);
    }

    @Test
    @Transactional
    void putNonExistingRoute() throws Exception {
        int databaseSizeBeforeUpdate = routeRepository.findAll().size();
        route.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRouteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, route.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(route))
            )
            .andExpect(status().isBadRequest());

        // Validate the Route in the database
        List<Route> routeList = routeRepository.findAll();
        assertThat(routeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRoute() throws Exception {
        int databaseSizeBeforeUpdate = routeRepository.findAll().size();
        route.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRouteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(route))
            )
            .andExpect(status().isBadRequest());

        // Validate the Route in the database
        List<Route> routeList = routeRepository.findAll();
        assertThat(routeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRoute() throws Exception {
        int databaseSizeBeforeUpdate = routeRepository.findAll().size();
        route.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRouteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(route)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Route in the database
        List<Route> routeList = routeRepository.findAll();
        assertThat(routeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRouteWithPatch() throws Exception {
        // Initialize the database
        routeRepository.saveAndFlush(route);

        int databaseSizeBeforeUpdate = routeRepository.findAll().size();

        // Update the route using partial update
        Route partialUpdatedRoute = new Route();
        partialUpdatedRoute.setId(route.getId());

        partialUpdatedRoute.description(UPDATED_DESCRIPTION).distance(UPDATED_DISTANCE).numReviews(UPDATED_NUM_REVIEWS);

        restRouteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRoute.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRoute))
            )
            .andExpect(status().isOk());

        // Validate the Route in the database
        List<Route> routeList = routeRepository.findAll();
        assertThat(routeList).hasSize(databaseSizeBeforeUpdate);
        Route testRoute = routeList.get(routeList.size() - 1);
        assertThat(testRoute.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testRoute.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testRoute.getRating()).isEqualTo(DEFAULT_RATING);
        assertThat(testRoute.getDistance()).isEqualTo(UPDATED_DISTANCE);
        assertThat(testRoute.getCost()).isEqualTo(DEFAULT_COST);
        assertThat(testRoute.getNumReviews()).isEqualTo(UPDATED_NUM_REVIEWS);
    }

    @Test
    @Transactional
    void fullUpdateRouteWithPatch() throws Exception {
        // Initialize the database
        routeRepository.saveAndFlush(route);

        int databaseSizeBeforeUpdate = routeRepository.findAll().size();

        // Update the route using partial update
        Route partialUpdatedRoute = new Route();
        partialUpdatedRoute.setId(route.getId());

        partialUpdatedRoute
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .rating(UPDATED_RATING)
            .distance(UPDATED_DISTANCE)
            .cost(UPDATED_COST)
            .numReviews(UPDATED_NUM_REVIEWS);

        restRouteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRoute.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRoute))
            )
            .andExpect(status().isOk());

        // Validate the Route in the database
        List<Route> routeList = routeRepository.findAll();
        assertThat(routeList).hasSize(databaseSizeBeforeUpdate);
        Route testRoute = routeList.get(routeList.size() - 1);
        assertThat(testRoute.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testRoute.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testRoute.getRating()).isEqualTo(UPDATED_RATING);
        assertThat(testRoute.getDistance()).isEqualTo(UPDATED_DISTANCE);
        assertThat(testRoute.getCost()).isEqualTo(UPDATED_COST);
        assertThat(testRoute.getNumReviews()).isEqualTo(UPDATED_NUM_REVIEWS);
    }

    @Test
    @Transactional
    void patchNonExistingRoute() throws Exception {
        int databaseSizeBeforeUpdate = routeRepository.findAll().size();
        route.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRouteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, route.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(route))
            )
            .andExpect(status().isBadRequest());

        // Validate the Route in the database
        List<Route> routeList = routeRepository.findAll();
        assertThat(routeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRoute() throws Exception {
        int databaseSizeBeforeUpdate = routeRepository.findAll().size();
        route.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRouteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(route))
            )
            .andExpect(status().isBadRequest());

        // Validate the Route in the database
        List<Route> routeList = routeRepository.findAll();
        assertThat(routeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRoute() throws Exception {
        int databaseSizeBeforeUpdate = routeRepository.findAll().size();
        route.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRouteMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(route)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Route in the database
        List<Route> routeList = routeRepository.findAll();
        assertThat(routeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRoute() throws Exception {
        // Initialize the database
        routeRepository.saveAndFlush(route);

        int databaseSizeBeforeDelete = routeRepository.findAll().size();

        // Delete the route
        restRouteMockMvc
            .perform(delete(ENTITY_API_URL_ID, route.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Route> routeList = routeRepository.findAll();
        assertThat(routeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
