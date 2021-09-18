package org.educ.store.controller;

import org.educ.store.model.dto.ResourceDto;
import org.educ.store.model.dto.ResourceInfo;
import org.educ.store.service.ResourceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;

@RestController
@RequestMapping(value = "/api/resource", produces = APPLICATION_JSON_UTF8_VALUE)
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @PostMapping
    public ResourceDto save(@RequestBody ResourceDto resourceDto) {
        return resourceService.save(resourceDto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") String id) {
        resourceService.delete(id);
    }

    @GetMapping
    public List<ResourceInfo> getAll() {
        return resourceService.getAll();
    }

    @GetMapping("/{id}")
    public ResourceDto findById(@PathVariable("id") String id) {
        return resourceService.findById(id);
    }

    @GetMapping("/{text}/text")
    public List<ResourceInfo> findByNameWith(@PathVariable("text") String text) {
        return resourceService.findByNameWith(text);
    }
}
