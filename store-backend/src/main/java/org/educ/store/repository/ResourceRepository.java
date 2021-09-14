package org.educ.store.repository;

import org.educ.store.model.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, String> {

    Resource findByInventoryId(String inventoryId);

    List<Resource> findByNameIsContaining(String text);

}
