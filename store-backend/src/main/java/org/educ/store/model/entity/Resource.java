package org.educ.store.model.entity;

import lombok.*;
import org.educ.store.model.dto.ResourceDto;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "resource")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Resource {

    @Id
    private String id;

    @Column(name = "inventory_id")
    private String inventoryId;

    @Column
    private String name;

    @Column
    private Integer amount;

    @Column
    private String comment;

    public ResourceDto toDto() {
        return ResourceDto.builder()
                .id(id)
                .name(name)
                .amount(amount)
                .comment(comment)
                .inventoryId(inventoryId)
                .build();
    }
}
