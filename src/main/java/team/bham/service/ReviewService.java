package team.bham.service;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import team.bham.domain.Review;
import team.bham.repository.ReviewRepository;

/**
 * Service Implementation for managing {@link Review}.
 */
@Service
@Transactional
public class ReviewService {

    private final Logger log = LoggerFactory.getLogger(ReviewService.class);

    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    /**
     * Save a review.
     *
     * @param review the entity to save.
     * @return the persisted entity.
     */
    public Review save(Review review) {
        log.debug("Request to save Review : {}", review);
        return reviewRepository.save(review);
    }

    /**
     * Update a review.
     *
     * @param review the entity to save.
     * @return the persisted entity.
     */
    public Review update(Review review) {
        log.debug("Request to update Review : {}", review);
        return reviewRepository.save(review);
    }

    /**
     * Partially update a review.
     *
     * @param review the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Review> partialUpdate(Review review) {
        log.debug("Request to partially update Review : {}", review);

        return reviewRepository
            .findById(review.getId())
            .map(existingReview -> {
                if (review.getUsername() != null) {
                    existingReview.setUsername(review.getUsername());
                }
                if (review.getTitle() != null) {
                    existingReview.setTitle(review.getTitle());
                }
                if (review.getContent() != null) {
                    existingReview.setContent(review.getContent());
                }
                if (review.getRating() != null) {
                    existingReview.setRating(review.getRating());
                }
                if (review.getReviewDate() != null) {
                    existingReview.setReviewDate(review.getReviewDate());
                }

                return existingReview;
            })
            .map(reviewRepository::save);
    }

    /**
     * Get all the reviews.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Review> findAll(Pageable pageable) {
        log.debug("Request to get all Reviews");
        return reviewRepository.findAll(pageable);
    }

    /**
     * Get one review by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Review> findOne(Long id) {
        log.debug("Request to get Review : {}", id);
        return reviewRepository.findById(id);
    }

    /**
     * Delete the review by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Review : {}", id);
        reviewRepository.deleteById(id);
    }
}
