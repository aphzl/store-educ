package org.educ.store.model.dto;

import lombok.*;
import org.educ.store.model.RequestStatus;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRequestDto implements Serializable {

    private String id;
    private String declarer;
    private RequestStatus status;
    private Long createdAt;
    private Long updatedAt;
    private List<RequestDto> requests;

}
