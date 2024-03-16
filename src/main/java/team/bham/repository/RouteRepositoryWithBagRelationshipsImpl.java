package team.bham.repository;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import team.bham.domain.Route;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class RouteRepositoryWithBagRelationshipsImpl implements RouteRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Route> fetchBagRelationships(Optional<Route> route) {
        return route.map(this::fetchTags);
    }

    @Override
    public Page<Route> fetchBagRelationships(Page<Route> routes) {
        return new PageImpl<>(fetchBagRelationships(routes.getContent()), routes.getPageable(), routes.getTotalElements());
    }

    @Override
    public List<Route> fetchBagRelationships(List<Route> routes) {
        return Optional.of(routes).map(this::fetchTags).orElse(Collections.emptyList());
    }

    Route fetchTags(Route result) {
        return entityManager
            .createQuery("select route from Route route left join fetch route.tags where route is :route", Route.class)
            .setParameter("route", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Route> fetchTags(List<Route> routes) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, routes.size()).forEach(index -> order.put(routes.get(index).getId(), index));
        List<Route> result = entityManager
            .createQuery("select distinct route from Route route left join fetch route.tags where route in :routes", Route.class)
            .setParameter("routes", routes)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
