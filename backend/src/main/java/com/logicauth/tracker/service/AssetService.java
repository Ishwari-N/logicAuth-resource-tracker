package com.logicauth.tracker.service;

import com.logicauth.tracker.model.Asset;
import com.logicauth.tracker.repository.AssetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssetService {

    @Autowired
    private AssetRepository assetRepository;

    public Asset addAsset(Asset asset) {
        return assetRepository.save(asset);
    }

    public List<Asset> getAllAssets() {
        return assetRepository.findAll();
    }

    public Asset updateAssetStatus(String id, String status) {
        Asset asset = assetRepository.findById(id).orElseThrow(() -> new RuntimeException("Asset not found"));
        asset.setStatus(status);
        return assetRepository.save(asset);
    }

    public List<Asset> getMyAssets(String email) {
        return assetRepository.findByAssignedToEmail(email);
    }
}