package com.example.emp_crud.controllers;

import com.example.emp_crud.models.City;
import com.example.emp_crud.repositories.CityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.emp_crud.services.ReportService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.io.ByteArrayInputStream;

@RestController
@RequestMapping("/api/cities")
public class CityController {
    @Autowired private CityRepository cityRepository;

    @Autowired
    private ReportService reportService;

    @GetMapping("/export/pdf")
    public ResponseEntity<InputStreamResource> exportToPdf() {
        ByteArrayInputStream bis = reportService.generateCityReport();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=cities.pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }

    @GetMapping
    public List<City> getAll() { return cityRepository.findAll(); }

    @PostMapping
    public City create(@RequestBody City city) { return cityRepository.save(city); }

    @PutMapping("/{id}")
    public ResponseEntity<City> update(@PathVariable Integer id, @RequestBody City details) {
        return cityRepository.findById(id).map(city -> {
            city.setName(details.getName());
            city.setState(details.getState());
            return ResponseEntity.ok(cityRepository.save(city));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        return cityRepository.findById(id).map(city -> {
            cityRepository.delete(city);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
