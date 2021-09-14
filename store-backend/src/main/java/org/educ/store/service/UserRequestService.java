package org.educ.store.service;

import org.educ.store.model.dto.RequestDto;
import org.educ.store.model.dto.ResourceDto;
import org.educ.store.model.dto.UserRequestDto;
import org.educ.store.model.entity.UserRequest;
import org.educ.store.repository.UserRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Optional.ofNullable;

@Service
public class UserRequestService {

    private final UserRequestRepository userRequestRepository;

    private final RequestService requestService;
    private final ResourceService resourceService;
    private final ConvertService convertService;

    public UserRequestService(
            UserRequestRepository userRequestRepository,
            RequestService requestService,
            ResourceService resourceService,
            ConvertService convertService
    ) {
        this.userRequestRepository = userRequestRepository;
        this.requestService = requestService;
        this.resourceService = resourceService;
        this.convertService = convertService;
    }

    @Transactional
    public List<UserRequestDto> findAll() {
        return userRequestRepository.findAll().stream()
                .map(UserRequest::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean trySave(UserRequestDto userRequestDto) {
        boolean amountsOk = ofNullable(userRequestDto.getRequests())
                .map(r -> r.stream().allMatch(this::isOkAmount))
                .orElse(true);

        if (amountsOk) {
            return save(userRequestDto) != null;
        } else {
            return false;
        }
    }

    @Transactional
    public UserRequestDto findById(String id) {
        return userRequestRepository.findById(id)
                .map(UserRequest::toDto)
                .orElse(null);
    }

    @Transactional
    public void delete(String id) {
        userRequestRepository.deleteById(id);
    }

    @Transactional
    public List<UserRequestDto> findByDeclarer(String declarer) {
        return userRequestRepository.findByDeclarer(declarer).stream()
                .map(UserRequest::toDto)
                .collect(Collectors.toList());
    }

    private boolean isOkAmount(RequestDto requestDto) {
        String resourceId = requestDto.getResourceId();
        int storedAmount = ofNullable(resourceService.findById(resourceId))
                .map(ResourceDto::getAmount)
                .orElse(0);
        int reservedAmount = requestService.getReservedNumber(resourceId);
        int available = storedAmount - reservedAmount;

        return available >= requestDto.getAmount();
    }

    private UserRequestDto save(UserRequestDto userRequestDto) {
        List<RequestDto> requests = userRequestDto.getRequests();

        userRequestDto.setRequests(new ArrayList<>());
        userRequestRepository.saveAndFlush(convertService.toEntity(userRequestDto));
        requests.forEach(requestService::save);

        return userRequestRepository
                .findById(userRequestDto.getId())
                .map(UserRequest::toDto)
                .orElse(null);
    }
}
