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
 * A Route.
 */
@Entity
@Table(name = "route")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Route implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "distance", nullable = false)
    private Double distance;

    @NotNull
    @Column(name = "stops", nullable = false)
    private Integer stops;

    @Column(name = "cost")
    private Double cost;

    @NotNull
    @Column(name = "duration", nullable = false)
    private Integer duration;

    @Column(name = "tag_name")
    private String tagName;

    @ManyToOne
    private City city;

    @ManyToMany(mappedBy = "routes")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "routes" }, allowSetters = true)
    private Set<Tag> tags = new HashSet<>();

    @ManyToMany(mappedBy = "routes")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "routes" }, allowSetters = true)
    private Set<AppUser> appUsers = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Route id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getDistance() {
        return this.distance;
    }

    public Route distance(Double distance) {
        this.setDistance(distance);
        return this;
    }

    public void setDistance(Double distance) {
        this.distance = distance;
    }

    public Integer getStops() {
        return this.stops;
    }

    public Route stops(Integer stops) {
        this.setStops(stops);
        return this;
    }

    public void setStops(Integer stops) {
        this.stops = stops;
    }

    public Double getCost() {
        return this.cost;
    }

    public Route cost(Double cost) {
        this.setCost(cost);
        return this;
    }

    public void setCost(Double cost) {
        this.cost = cost;
    }

    public Integer getDuration() {
        return this.duration;
    }

    public Route duration(Integer duration) {
        this.setDuration(duration);
        return this;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public String getTagName() {
        return this.tagName;
    }

    public Route tagName(String tagName) {
        this.setTagName(tagName);
        return this;
    }

    public void setTagName(String tagName) {
        this.tagName = tagName;
    }

    public City getCity() {
        return this.city;
    }

    public void setCity(City city) {
        this.city = city;
    }

    public Route city(City city) {
        this.setCity(city);
        return this;
    }

    public Set<Tag> getTags() {
        return this.tags;
    }

    public void setTags(Set<Tag> tags) {
        if (this.tags != null) {
            this.tags.forEach(i -> i.removeRoute(this));
        }
        if (tags != null) {
            tags.forEach(i -> i.addRoute(this));
        }
        this.tags = tags;
    }

    public Route tags(Set<Tag> tags) {
        this.setTags(tags);
        return this;
    }

    public Route addTag(Tag tag) {
        this.tags.add(tag);
        tag.getRoutes().add(this);
        return this;
    }

    public Route removeTag(Tag tag) {
        this.tags.remove(tag);
        tag.getRoutes().remove(this);
        return this;
    }

    public Set<AppUser> getAppUsers() {
        return this.appUsers;
    }

    public void setAppUsers(Set<AppUser> appUsers) {
        if (this.appUsers != null) {
            this.appUsers.forEach(i -> i.removeRoute(this));
        }
        if (appUsers != null) {
            appUsers.forEach(i -> i.addRoute(this));
        }
        this.appUsers = appUsers;
    }

    public Route appUsers(Set<AppUser> appUsers) {
        this.setAppUsers(appUsers);
        return this;
    }

    public Route addAppUser(AppUser appUser) {
        this.appUsers.add(appUser);
        appUser.getRoutes().add(this);
        return this;
    }

    public Route removeAppUser(AppUser appUser) {
        this.appUsers.remove(appUser);
        appUser.getRoutes().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Route)) {
            return false;
        }
        return id != null && id.equals(((Route) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Route{" +
            "id=" + getId() +
            ", distance=" + getDistance() +
            ", stops=" + getStops() +
            ", cost=" + getCost() +
            ", duration=" + getDuration() +
            ", tagName='" + getTagName() + "'" +
            "}";
    }
}
