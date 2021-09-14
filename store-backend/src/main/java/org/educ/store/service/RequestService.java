package org.educ.store.service;

import org.educ.store.model.RequestStatus;
import org.educ.store.model.dto.RequestDto;
import org.educ.store.model.entity.Request;
import org.educ.store.repository.RequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RequestService {

    private final RequestRepository requestRepository;

    private final ConvertService convertService;

    public RequestService(RequestRepository requestRepository, ConvertService convertService) {
        this.requestRepository = requestRepository;
        this.convertService = convertService;
    }

    @Transactional
    public List<RequestDto> findOpenRequestByResourceId(String resourceId) {
        return requestRepository
                .findByUserRequestStatusInAndResourceId(Arrays.asList(RequestStatus.OPEN, RequestStatus.READY), resourceId).stream()
                .map(Request::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public Integer getReservedNumber(String resourceId) {
        return findOpenRequestByResourceId(resourceId).stream()
                .mapToInt(RequestDto::getAmount)
                .sum();
    }

    @Transactional
    public void save(RequestDto requestDto) {
        requestRepository.save(convertService.toEntity(requestDto));
    }
}
