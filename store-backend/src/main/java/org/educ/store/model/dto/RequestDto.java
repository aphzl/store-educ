package org.educ.store.model.dto;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestDto implements Serializable {

    private String id;
    private String userRequestId;
    private String resourceId;
    private Integer amount;

}
