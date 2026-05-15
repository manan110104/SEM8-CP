package com.adite.recruitment.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;

@Configuration
@Profile("prod")
public class ProductionDataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(ProductionDataSourceConfig.class);

    @Bean
    public DataSource dataSource(
            @Value("${DATABASE_URL:}") String databaseUrl,
            @Value("${SPRING_DATASOURCE_URL:}") String springDatasourceUrl,
            @Value("${DB_USERNAME:}") String username,
            @Value("${DB_PASSWORD:}") String password
    ) {
        String url = firstNonBlank(databaseUrl, springDatasourceUrl);
        HikariConfig config = new HikariConfig();
        config.setMaximumPoolSize(5);
        config.setConnectionTimeout(60000);
        config.setInitializationFailTimeout(60000);

        if (url.isBlank()) {
            log.warn("No DATABASE_URL configured — using in-memory H2 (demo data only, resets on restart)");
            config.setJdbcUrl("jdbc:h2:mem:recruitmentdb;DB_CLOSE_DELAY=-1;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE");
            config.setDriverClassName("org.h2.Driver");
            config.setUsername("sa");
            config.setPassword("");
            return new HikariDataSource(config);
        }

        url = normalizeJdbcUrl(url);
        config.setJdbcUrl(url);
        config.setDriverClassName(driverForUrl(url));

        if (!username.isBlank()) {
            config.setUsername(username);
        }
        if (!password.isBlank()) {
            config.setPassword(password);
        }

        log.info("Production database: {}", maskUrl(url));
        return new HikariDataSource(config);
    }

    private static String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value.trim();
            }
        }
        return "";
    }

    private static String normalizeJdbcUrl(String url) {
        if (url.startsWith("postgres://")) {
            return "jdbc:postgresql://" + url.substring("postgres://".length());
        }
        if (url.startsWith("postgresql://")) {
            return "jdbc:" + url;
        }
        return url;
    }

    private static String driverForUrl(String url) {
        if (url.contains(":postgresql:")) {
            return "org.postgresql.Driver";
        }
        if (url.contains(":mysql:")) {
            return "com.mysql.cj.jdbc.Driver";
        }
        if (url.contains(":h2:")) {
            return "org.h2.Driver";
        }
        throw new IllegalArgumentException("Unsupported database URL: " + maskUrl(url));
    }

    private static String maskUrl(String url) {
        return url.replaceAll("password=[^&]*", "password=***");
    }
}
