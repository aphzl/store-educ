package org.educ.store.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.io.Serializable;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceDto implements Serializable {

    private String id;
    private String inventoryId;
    private String name;
    private Integer amount;
    private String comment;

}
