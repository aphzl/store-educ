package org.educ.store.model.entity;

import lombok.*;
import org.educ.store.model.dto.RequestDto;

import javax.persistence.*;

@Entity
@Table(name = "request")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Request {

    @Id
    private String id;

    @ManyToOne
    @JoinColumns(value = @JoinColumn(name = "user_request_id", referencedColumnName = "id"))
    private UserRequest userRequest;

    @Column(name = "resource_id")
    private String resourceId;

    @Column
    private Integer amount;

    public RequestDto toDto() {
        return RequestDto.builder()
                .id(id)
                .amount(amount)
                .resourceId(resourceId)
                .userRequestId(userRequest.getId())
                .build();
    }

}
