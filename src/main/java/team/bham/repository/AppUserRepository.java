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
 *
 * When extending this class, extend AppUserRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface AppUserRepository extends AppUserRepositoryWithBagRelationships, JpaRepository<AppUser, Long> {
    default Optional<AppUser> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findOneWithToOneRelationships(id));
    }

    default List<AppUser> findAllWithEagerRelationships(String login) {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships(login));
    }

    default List<AppUser> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships());
    }

    default Page<AppUser> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships(pageable));
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

    @Query(
        "select appUser from AppUser appUser left join fetch appUser.user where appUser.user.login like :login% order by appUser.user.login"
    )
    List<AppUser> findAllWithToOneRelationships(@Param("login") String login);

    @Query("select appUser from AppUser appUser where appUser.user.login = :login")
    Optional<AppUser> findOneByUser_Login(@Param("login") String login);

    @Modifying
    @Query(
        "delete from AppUser appUser\n" +
        "where appUser.id in (\n" +
        "    select au.id from AppUser au\n" +
        "    join User u on au.user.id = u.id\n" +
        "    where u.login = :login\n" +
        ")"
    )
    void deleteByLogin(@Param("login") String login);

    @Modifying
    @Query("UPDATE AppUser appUser SET appUser.numRoutes = appUser.numRoutes + 1 WHERE appUser.id = :id")
    void updateNumRoutes(@Param("id") Long id);

    @Modifying
    @Query("UPDATE AppUser appUser SET appUser.numReviews = appUser.numReviews + 1 WHERE appUser.id = :id")
    void updateNumReviews(@Param("id") Long id);
}
