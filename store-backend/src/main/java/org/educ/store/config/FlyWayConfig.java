package org.educ.store.config;

import org.flywaydb.core.Flyway;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class FlyWayConfig {

    private final DataSource dataSource;

    public FlyWayConfig(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Bean(initMethod = "migrate")
    public Flyway flyway() {
        Flyway flyway = new Flyway();
        flyway.setDataSource(dataSource);
        flyway.setOutOfOrder(true);
        flyway.setValidateOnMigrate(true);
        flyway.setPlaceholderPrefix("NO---------------NO");

        return flyway;
    }
}
