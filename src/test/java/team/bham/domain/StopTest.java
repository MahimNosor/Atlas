package team.bham.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import team.bham.web.rest.TestUtil;

class StopTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Stop.class);
        Stop stop1 = new Stop();
        stop1.setId(1L);
        Stop stop2 = new Stop();
        stop2.setId(stop1.getId());
        assertThat(stop1).isEqualTo(stop2);
        stop2.setId(2L);
        assertThat(stop1).isNotEqualTo(stop2);
        stop1.setId(null);
        assertThat(stop1).isNotEqualTo(stop2);
    }
}
