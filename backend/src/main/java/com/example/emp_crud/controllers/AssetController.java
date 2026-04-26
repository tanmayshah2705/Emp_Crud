package com.example.emp_crud.controllers;

import com.example.emp_crud.models.CompanyAsset;
import com.example.emp_crud.repositories.AssetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
public class AssetController {

    @Autowired
    private AssetRepository assetRepository;

    @GetMapping
    public List<CompanyAsset> getAll() {
        return assetRepository.findAll();
    }

    @GetMapping("/employee/{employeeId}")
    public List<CompanyAsset> getByEmployee(@PathVariable String employeeId) {
        return assetRepository.findByAssignedTo(employeeId);
    }

    @PostMapping
    public CompanyAsset create(@RequestBody CompanyAsset asset) {
        return assetRepository.save(asset);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody CompanyAsset asset) {
        return assetRepository.findById(id).map(existing -> {
            existing.setAssetType(asset.getAssetType());
            existing.setSerialNumber(asset.getSerialNumber());
            existing.setAssignedTo(asset.getAssignedTo());
            existing.setAssignedName(asset.getAssignedName());
            existing.setWarrantyExpiry(asset.getWarrantyExpiry());
            existing.setAssetCondition(asset.getAssetCondition());
            assetRepository.save(existing);
            return ResponseEntity.ok(existing);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        assetRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
