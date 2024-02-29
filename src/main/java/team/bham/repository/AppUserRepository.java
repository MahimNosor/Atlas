package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import team.bham.domain.AppUser;

/**
 * Spring Data JPA repository for the AppUser entity.
 */
@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    default Optional<AppUser> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<AppUser> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<AppUser> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct appUser from AppUser appUser left join fetch appUser.user",
        countQuery = "select count(distinct appUser) from AppUser appUser"
    )
    Page<AppUser> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct appUser from AppUser appUser left join fetch appUser.user")
    List<AppUser> findAllWithToOneRelationships();

    @Query("select appUser from AppUser appUser left join fetch appUser.user where appUser.id =:id")
    Optional<AppUser> findOneWithToOneRelationships(@Param("id") Long id);
}
