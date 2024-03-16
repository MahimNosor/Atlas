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

    @OneToMany(mappedBy = "appUser")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "stops", "tags", "city", "appUser" }, allowSetters = true)
    private Set<Route> routes = new HashSet<>();

    @OneToMany(mappedBy = "appUser")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "appUser" }, allowSetters = true)
    private Set<Review> reviews = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "rel_app_user__tag",
        joinColumns = @JoinColumn(name = "app_user_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "routes", "appUsers" }, allowSetters = true)
    private Set<Tag> tags = new HashSet<>();

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
        if (this.routes != null) {
            this.routes.forEach(i -> i.setAppUser(null));
        }
        if (routes != null) {
            routes.forEach(i -> i.setAppUser(this));
        }
        this.routes = routes;
    }

    public AppUser routes(Set<Route> routes) {
        this.setRoutes(routes);
        return this;
    }

    public AppUser addRoute(Route route) {
        this.routes.add(route);
        route.setAppUser(this);
        return this;
    }

    public AppUser removeRoute(Route route) {
        this.routes.remove(route);
        route.setAppUser(null);
        return this;
    }

    public Set<Review> getReviews() {
        return this.reviews;
    }

    public void setReviews(Set<Review> reviews) {
        if (this.reviews != null) {
            this.reviews.forEach(i -> i.setAppUser(null));
        }
        if (reviews != null) {
            reviews.forEach(i -> i.setAppUser(this));
        }
        this.reviews = reviews;
    }

    public AppUser reviews(Set<Review> reviews) {
        this.setReviews(reviews);
        return this;
    }

    public AppUser addReview(Review review) {
        this.reviews.add(review);
        review.setAppUser(this);
        return this;
    }

    public AppUser removeReview(Review review) {
        this.reviews.remove(review);
        review.setAppUser(null);
        return this;
    }

    public Set<Tag> getTags() {
        return this.tags;
    }

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }

    public AppUser tags(Set<Tag> tags) {
        this.setTags(tags);
        return this;
    }

    public AppUser addTag(Tag tag) {
        this.tags.add(tag);
        tag.getAppUsers().add(this);
        return this;
    }

    public AppUser removeTag(Tag tag) {
        this.tags.remove(tag);
        tag.getAppUsers().remove(this);
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
