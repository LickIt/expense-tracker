package org.github.giliev.expensetracker.backend.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import static java.util.Collections.singletonList;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedHeaders(singletonList("*"));
        config.setAllowedMethods(singletonList("*"));
        config.addAllowedOrigin("*");
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
            .antMatchers("/api/**")
            .authenticated()
            .antMatchers("/v3/api-docs/**", "/swagger-ui.html", "/swagger-ui/**")
            .permitAll()
            .anyRequest()
            .denyAll()
            .and()
            .cors()
            .and()
            .csrf()
            .disable()
            .oauth2ResourceServer()
            .jwt();
    }

}