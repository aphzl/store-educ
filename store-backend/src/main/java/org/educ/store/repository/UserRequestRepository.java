package org.educ.store.repository;

import org.educ.store.model.entity.UserRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRequestRepository extends JpaRepository<UserRequest, String> {

    List<UserRequest> findByDeclarer(String declarer);

}
