package com.example.emp_crud.repositories;
import com.example.emp_crud.models.CompanyAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AssetRepository extends JpaRepository<CompanyAsset, Long> {
    List<CompanyAsset> findByAssignedTo(String employeeId);
    List<CompanyAsset> findByAssetType(String assetType);
}
