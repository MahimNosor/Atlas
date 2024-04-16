package team.bham.service;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import team.bham.domain.AppUser;
import team.bham.repository.AppUserRepository;

/**
 * Service Implementation for managing {@link AppUser}.
 */
@Service
@Transactional
public class AppUserService {

    private final Logger log = LoggerFactory.getLogger(AppUserService.class);

    private final AppUserRepository appUserRepository;

    public AppUserService(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    /**
     * Save a appUser.
     *
     * @param appUser the entity to save.
     * @return the persisted entity.
     */
    public AppUser save(AppUser appUser) {
        log.debug("Request to save AppUser : {}", appUser);
        return appUserRepository.save(appUser);
    }

    /**
     * Update a appUser.
     *
     * @param appUser the entity to save.
     * @return the persisted entity.
     */
    public AppUser update(AppUser appUser) {
        log.debug("Request to update AppUser : {}", appUser);
        return appUserRepository.save(appUser);
    }

    /**
     * Partially update a appUser.
     *
     * @param appUser the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<AppUser> partialUpdate(AppUser appUser) {
        log.debug("Request to partially update AppUser : {}", appUser);

        return appUserRepository
            .findById(appUser.getId())
            .map(existingAppUser -> {
                if (appUser.getNumRoutes() != null) {
                    existingAppUser.setNumRoutes(appUser.getNumRoutes());
                }
                if (appUser.getNumReviews() != null) {
                    existingAppUser.setNumReviews(appUser.getNumReviews());
                }

                return existingAppUser;
            })
            .map(appUserRepository::save);
    }

    /**
     * Get all the appUsers.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<AppUser> findAll(Pageable pageable) {
        log.debug("Request to get all AppUsers");
        return appUserRepository.findAll(pageable);
    }

    /**
     * Get all the appUsers with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<AppUser> findAllWithEagerRelationships(Pageable pageable) {
        return appUserRepository.findAllWithEagerRelationships(pageable);
    }

    /**
     * Get one appUser by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<AppUser> findOne(Long id) {
        log.debug("Request to get AppUser : {}", id);
        return appUserRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Get multiple appUsers by login.
     *
     * @param login the login of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public List<AppUser> findByLogin(String login) {
        log.debug("Request to get AppUser by login : {}", login);
        return appUserRepository.findAllWithEagerRelationships(login);
    }

    /**
     * Get one appUser by username (login).
     *
     * @param login the username of the User entity linked to the AppUser.
     * @return the entity if found.
     */
    @Transactional(readOnly = true)
    public Optional<AppUser> findOneByUserLogin(String login) {
        log.debug("Request to get AppUser by username : {}", login);
        return appUserRepository.findOneByUser_Login(login);
    }

    /**
     * Delete the appUser by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete AppUser : {}", id);
        appUserRepository.deleteById(id);
    }

    /**
     * Delete the appUser by login.
     *
     * @param login the login of the entity.
     */
    public void delete(String login) {
        log.debug("Request to delete AppUser by login : {}", login);
        appUserRepository.deleteByLogin(login);
    }
}
