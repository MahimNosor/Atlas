package team.bham.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import team.bham.domain.Tag;

public interface TagRepositoryWithBagRelationships {
    Optional<Tag> fetchBagRelationships(Optional<Tag> tag);

    List<Tag> fetchBagRelationships(List<Tag> tags);

    Page<Tag> fetchBagRelationships(Page<Tag> tags);
}
