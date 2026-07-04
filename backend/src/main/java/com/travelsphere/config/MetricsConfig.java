package com.travelsphere.config;

import io.micrometer.core.instrument.Clock;
import io.micrometer.core.instrument.util.HierarchicalNameMapper;
import io.micrometer.core.instrument.config.NamingConvention;
import io.micrometer.graphite.GraphiteConfig;
import io.micrometer.graphite.GraphiteMeterRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Configuration
public class MetricsConfig {

    @Bean
    public HierarchicalNameMapper hierarchicalNameMapper() {
        return (id, convention) -> {
            String name = id.getConventionName(NamingConvention.dot);
            if (id.getTagsAsIterable().iterator().hasNext()) {
                String tags = StreamSupport.stream(id.getTagsAsIterable().spliterator(), false)
                        .map(tag -> tag.getValue().replace(" ", "_").replace(".", "_"))
                        .collect(Collectors.joining("."));
                return name + "." + tags;
            }
            return name;
        };
    }

    @Bean
    public GraphiteMeterRegistry graphiteMeterRegistry(GraphiteConfig config, Clock clock, HierarchicalNameMapper mapper) {
        return new GraphiteMeterRegistry(config, clock, mapper);
    }
}
