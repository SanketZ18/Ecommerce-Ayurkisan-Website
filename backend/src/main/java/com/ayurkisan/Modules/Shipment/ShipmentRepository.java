package com.ayurkisan.Modules.Shipment;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShipmentRepository extends MongoRepository<Shipment, String> {
    Optional<Shipment> findByOrderId(String orderId);
}
