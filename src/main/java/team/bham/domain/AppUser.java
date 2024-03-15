package team.bham.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A AppUser.
 */
@Entity
@Table(name = "app_user")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AppUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "num_routes", nullable = false)
    private Integer numRoutes;

    @NotNull
    @Column(name = "num_reviews", nullable = false)
    private Integer numReviews;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    @ManyToMany
    @JoinTable(
        name = "rel_app_user__route",
        joinColumns = @JoinColumn(name = "app_user_id"),
        inverseJoinColumns = @JoinColumn(name = "route_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "city", "tags", "appUsers" }, allowSetters = true)
    private Set<Route> routes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public AppUser id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNumRoutes() {
        return this.numRoutes;
    }

    public AppUser numRoutes(Integer numRoutes) {
        this.setNumRoutes(numRoutes);
        return this;
    }

    public void setNumRoutes(Integer numRoutes) {
        this.numRoutes = numRoutes;
    }

    public Integer getNumReviews() {
        return this.numReviews;
    }

    public AppUser numReviews(Integer numReviews) {
        this.setNumReviews(numReviews);
        return this;
    }

    public void setNumReviews(Integer numReviews) {
        this.numReviews = numReviews;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public AppUser user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<Route> getRoutes() {
        return this.routes;
    }

    public void setRoutes(Set<Route> routes) {
        this.routes = routes;
    }

    public AppUser routes(Set<Route> routes) {
        this.setRoutes(routes);
        return this;
    }

    public AppUser addRoute(Route route) {
        this.routes.add(route);
        route.getAppUsers().add(this);
        return this;
    }

    public AppUser removeRoute(Route route) {
        this.routes.remove(route);
        route.getAppUsers().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AppUser)) {
            return false;
        }
        return id != null && id.equals(((AppUser) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AppUser{" +
            "id=" + getId() +
            ", numRoutes=" + getNumRoutes() +
            ", numReviews=" + getNumReviews() +
            "}";
    }
}
