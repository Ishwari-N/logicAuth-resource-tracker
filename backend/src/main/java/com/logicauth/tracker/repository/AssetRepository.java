package com.logicauth.tracker.repository;

import com.logicauth.tracker.model.Asset;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AssetRepository extends MongoRepository<Asset, String> {
    List<Asset> findByStatus(String status);
    List<Asset> findByAssignedToEmail(String email);
    List<Asset> findBySerialNumber(String serialNumber);
}