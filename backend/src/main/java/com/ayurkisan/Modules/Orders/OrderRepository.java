package com.ayurkisan.Modules.Orders;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {

    List<Order> findAllByUserIdOrderByCreatedAtDesc(String userId);

    List<Order> findByUserId(String userId, Pageable pageable);

    long countByUserId(String userId);

    List<Order> findByOrderStatus(String orderStatus);

    List<Order> findByPaymentStatus(String paymentStatus);
}
