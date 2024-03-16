package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import team.bham.domain.Route;

public interface RouteRepositoryWithBagRelationships {
    Optional<Route> fetchBagRelationships(Optional<Route> route);

    List<Route> fetchBagRelationships(List<Route> routes);

    Page<Route> fetchBagRelationships(Page<Route> routes);
}
