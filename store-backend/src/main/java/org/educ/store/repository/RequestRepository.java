package org.educ.store.repository;

import org.educ.store.model.RequestStatus;
import org.educ.store.model.entity.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, String> {

    List<Request> findByUserRequestStatusAndResourceId(RequestStatus status, String resourceId);

}
