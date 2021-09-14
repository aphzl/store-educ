package org.educ.store.controller;

import org.educ.store.model.dto.UserRequestDto;
import org.educ.store.service.RequestService;
import org.educ.store.service.UserRequestService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;

@RestController
@RequestMapping(value = "/api/user-request", produces = APPLICATION_JSON_UTF8_VALUE)
public class UserRequestController {

    private final UserRequestService userRequestService;
    private final RequestService requestService;

    public UserRequestController(UserRequestService userRequestService, RequestService requestService) {
        this.userRequestService = userRequestService;
        this.requestService = requestService;
    }

    @GetMapping
    public List<UserRequestDto> findAll() {
        return userRequestService.findAll();
    }

    @PostMapping
    public Boolean trySave(@RequestBody UserRequestDto userRequestDto) {
        return userRequestService.trySave(userRequestDto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") String id) {
        userRequestService.delete(id);
    }

    @GetMapping("/{id}")
    public UserRequestDto findById(@PathVariable("id") String id) {
        return userRequestService.findById(id);
    }

    @GetMapping("/{declarer}/declarer")
    public List<UserRequestDto> findByDeclarer(@PathVariable("declarer") String declarer) {
        return userRequestService.findByDeclarer(declarer);
    }

    @GetMapping("/{resourceId}/reserved")
    public Integer getReservedNumber(String resourceId) {
        return requestService.getReservedNumber(resourceId);
    }
}
