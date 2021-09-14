package org.educ.store.service;

import org.educ.store.model.dto.RequestDto;
import org.educ.store.model.dto.ResourceDto;
import org.educ.store.model.dto.UserRequestDto;
import org.educ.store.model.entity.Request;
import org.educ.store.model.entity.Resource;
import org.educ.store.model.entity.UserRequest;
import org.educ.store.repository.UserRequestRepository;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConvertService {

    private final UserRequestRepository userRequestRepository;

    public ConvertService(UserRequestRepository userRequestRepository) {
        this.userRequestRepository = userRequestRepository;
    }

    public Request toEntity(RequestDto dto) {
        UserRequest userRequest = userRequestRepository.findById(dto.getUserRequestId()).orElse(null);

        return Request.builder()
                .id(dto.getId())
                .userRequest(userRequest)
                .resourceId(dto.getResourceId())
                .amount(dto.getAmount())
                .build();
    }

    public UserRequest toEntity(UserRequestDto dto) {
        List<Request> requests = dto.getRequests() == null
                ? new ArrayList<>()
                : dto.getRequests().stream()
                        .map(this::toEntity)
                        .collect(Collectors.toList());

        return UserRequest.builder()
                .id(dto.getId())
                .declarer(dto.getDeclarer())
                .comment(dto.getComment())
                .status(dto.getStatus())
                .requests(requests)
                .build();
    }

    public Resource toEntity(ResourceDto dto) {
        return Resource.builder()
                .id(dto.getId())
                .inventoryId(dto.getInventoryId())
                .name(dto.getName())
                .amount(dto.getAmount())
                .comment(dto.getComment())
                .build();
    }

}
