package org.educ.store.service;

import org.educ.store.model.dto.ResourceDto;
import org.educ.store.model.dto.ResourceInfo;
import org.educ.store.model.entity.Resource;
import org.educ.store.repository.ResourceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;

    private final RequestService requestService;
    private final ConvertService convertService;

    public ResourceService(
            ResourceRepository resourceRepository,
            RequestService requestService,
            ConvertService convertService
    ) {
        this.resourceRepository = resourceRepository;
        this.requestService = requestService;
        this.convertService = convertService;
    }

    @Transactional
    public ResourceDto save(ResourceDto resourceDto) {
        return resourceRepository
                .save(convertService.toEntity(resourceDto))
                .toDto();
    }

    @Transactional
    public void delete(String id) {
        resourceRepository.deleteById(id);
    }

    @Transactional
    public List<ResourceInfo> getAll() {
        return resourceRepository.findAll().stream()
                .map(Resource::toDto)
                .map(this::toResourceInfo)
                .collect(Collectors.toList());
    }

    @Transactional
    public ResourceDto findById(String id) {
        return resourceRepository.findById(id)
                .map(Resource::toDto)
                .orElse(null);
    }

    @Transactional
    public ResourceDto findByInventoryId(String inventoryId) {
        return resourceRepository.findByInventoryId(inventoryId).toDto();
    }

    @Transactional
    public List<ResourceInfo> findByNameWith(String text) {
        return resourceRepository.findByNameIsContaining(text).stream()
                .map(Resource::toDto)
                .map(this::toResourceInfo)
                .collect(Collectors.toList());
    }

    private ResourceInfo toResourceInfo(ResourceDto resourceDto) {
        int reserved = requestService.getReservedNumber(resourceDto.getId());

        return ResourceInfo.builder()
                .id(resourceDto.getId())
                .inventoryId(resourceDto.getInventoryId())
                .name(resourceDto.getName())
                .amount(resourceDto.getAmount())
                .comment(resourceDto.getComment())
                .reserved(reserved)
                .available(resourceDto.getAmount() - reserved)
                .build();
    }
}
