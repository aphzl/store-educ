package org.educ.store.model.entity;

import lombok.*;
import org.educ.store.model.RequestStatus;
import org.educ.store.model.dto.RequestDto;
import org.educ.store.model.dto.UserRequestDto;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "user_request")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {

    @Id
    private String id;

    @Column
    private String declarer;

    @Column
    @Enumerated(value = EnumType.STRING)
    private RequestStatus status;

    @Column(name = "created_timestamp")
    private Timestamp createdAt;
    @Column(name = "updated_timestamp")
    private Timestamp updatedAt;

    @OneToMany(mappedBy = "userRequest")
    private List<Request> requests;

    @PrePersist
    public void onPrePersist() {
        createdAt = new Timestamp(System.currentTimeMillis());
        updatedAt = createdAt;
    }

    @PreUpdate
    public void onPreUpdate() {
        updatedAt = new Timestamp(System.currentTimeMillis());
    }

    public UserRequestDto toDto() {
        List<RequestDto> requestDtos = requests == null
                ? new ArrayList<>()
                : requests.stream().map(Request::toDto).collect(Collectors.toList());

        return UserRequestDto.builder()
                .id(id)
                .declarer(declarer)
                .status(status)
                .createdAt(createdAt.getTime())
                .updatedAt(updatedAt.getTime())
                .requests(requestDtos)
                .build();
    }

}
