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
 * A City.
 */
@Entity
@Table(name = "city")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class City implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "rating", nullable = false)
    private Integer rating;

    @NotNull
    @Column(name = "num_routes", nullable = false)
    private Integer numRoutes;

    @OneToMany(mappedBy = "city")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "stops", "city", "appUser", "tags" }, allowSetters = true)
    private Set<Route> routes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public City id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public City name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getRating() {
        return this.rating;
    }

    public City rating(Integer rating) {
        this.setRating(rating);
        return this;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public Integer getNumRoutes() {
        return this.numRoutes;
    }

    public City numRoutes(Integer numRoutes) {
        this.setNumRoutes(numRoutes);
        return this;
    }

    public void setNumRoutes(Integer numRoutes) {
        this.numRoutes = numRoutes;
    }

    public Set<Route> getRoutes() {
        return this.routes;
    }

    public void setRoutes(Set<Route> routes) {
        if (this.routes != null) {
            this.routes.forEach(i -> i.setCity(null));
        }
        if (routes != null) {
            routes.forEach(i -> i.setCity(this));
        }
        this.routes = routes;
    }

    public City routes(Set<Route> routes) {
        this.setRoutes(routes);
        return this;
    }

    public City addRoute(Route route) {
        this.routes.add(route);
        route.setCity(this);
        return this;
    }

    public City removeRoute(Route route) {
        this.routes.remove(route);
        route.setCity(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof City)) {
            return false;
        }
        return id != null && id.equals(((City) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "City{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", rating=" + getRating() +
            ", numRoutes=" + getNumRoutes() +
            "}";
    }
}
