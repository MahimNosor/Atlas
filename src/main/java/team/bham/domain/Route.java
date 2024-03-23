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
    @Column(name = "title", nullable = false)
    private String title;

    @NotNull
    @Column(name = "description", nullable = false)
    private String description;

    @NotNull
    @Column(name = "rating", nullable = false)
    private Integer rating;

    @NotNull
    @Column(name = "distance", nullable = false)
    private Double distance;

    @Column(name = "cost")
    private Double cost;

    @NotNull
    @Column(name = "num_reviews", nullable = false)
    private Integer numReviews;

    @OneToMany(mappedBy = "route")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "route" }, allowSetters = true)
    private Set<Stop> stops = new HashSet<>();

    @ManyToMany
    @JoinTable(name = "rel_route__tag", joinColumns = @JoinColumn(name = "route_id"), inverseJoinColumns = @JoinColumn(name = "tag_id"))
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "routes", "appUsers" }, allowSetters = true)
    private Set<Tag> tags = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "routes" }, allowSetters = true)
    private City city;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "routes", "reviews", "tags" }, allowSetters = true)
    private AppUser appUser;

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

    public String getTitle() {
        return this.title;
    }

    public Route title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return this.description;
    }

    public Route description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getRating() {
        return this.rating;
    }

    public Route rating(Integer rating) {
        this.setRating(rating);
        return this;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
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

    public Integer getNumReviews() {
        return this.numReviews;
    }

    public Route numReviews(Integer numReviews) {
        this.setNumReviews(numReviews);
        return this;
    }

    public void setNumReviews(Integer numReviews) {
        this.numReviews = numReviews;
    }

    public Set<Stop> getStops() {
        return this.stops;
    }

    public void setStops(Set<Stop> stops) {
        if (this.stops != null) {
            this.stops.forEach(i -> i.setRoute(null));
        }
        if (stops != null) {
            stops.forEach(i -> i.setRoute(this));
        }
        this.stops = stops;
    }

    public Route stops(Set<Stop> stops) {
        this.setStops(stops);
        return this;
    }

    public Route addStop(Stop stop) {
        this.stops.add(stop);
        stop.setRoute(this);
        return this;
    }

    public Route removeStop(Stop stop) {
        this.stops.remove(stop);
        stop.setRoute(null);
        return this;
    }

    public Set<Tag> getTags() {
        return this.tags;
    }

    public void setTags(Set<Tag> tags) {
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

    public AppUser getAppUser() {
        return this.appUser;
    }

    public void setAppUser(AppUser appUser) {
        this.appUser = appUser;
    }

    public Route appUser(AppUser appUser) {
        this.setAppUser(appUser);
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
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", rating=" + getRating() +
            ", distance=" + getDistance() +
            ", cost=" + getCost() +
            ", numReviews=" + getNumReviews() +
            "}";
    }
    //    public Set<Long> getTagIds() {
    //        Set<Long> tagIds = new HashSet<>();
    //        for (Tag tag : tags) {
    //            tagIds.add(tag.getId());
    //        }
    //        return tagIds;
    //    }
}
