package com.logicauth.tracker.controller;

import com.logicauth.tracker.model.Asset;
import com.logicauth.tracker.service.AssetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
// Ensure this is present to avoid browser 403 errors later
@CrossOrigin(origins = "*", maxAge = 3600) 
public class AssetController {

    @Autowired
    private AssetService assetService;

    @PostMapping("/add")
    public ResponseEntity<Asset> addAsset(@RequestBody Asset asset) {
        return ResponseEntity.ok(assetService.addAsset(asset));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Asset>> getAllAssets() {
        return ResponseEntity.ok(assetService.getAllAssets());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Asset> updateStatus(@PathVariable String id, @RequestParam String status) {
        return ResponseEntity.ok(assetService.updateAssetStatus(id, status));
    }

    @GetMapping("/my-assets")
    public ResponseEntity<List<Asset>> getMyAssets(@RequestParam String email) {
        return ResponseEntity.ok(assetService.getMyAssets(email));
    }
}