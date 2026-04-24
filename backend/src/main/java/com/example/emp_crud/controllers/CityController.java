package com.example.emp_crud.controllers;

import com.example.emp_crud.models.City;
import com.example.emp_crud.repositories.CityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cities")
public class CityController {
    @Autowired private CityRepository cityRepository;

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
