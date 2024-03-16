package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import team.bham.domain.Stop;

/**
 * Spring Data JPA repository for the Stop entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StopRepository extends JpaRepository<Stop, Long> {
    List<Stop> findByRouteId(Long routeId);
}
