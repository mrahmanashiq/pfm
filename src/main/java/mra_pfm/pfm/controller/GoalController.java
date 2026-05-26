package mra_pfm.pfm.controller;

import lombok.RequiredArgsConstructor;
import mra_pfm.pfm.dto.GoalDto;
import mra_pfm.pfm.service.GoalService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/goals")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class GoalController {

    private final GoalService goalService;

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<GoalDto>> getUserGoals() {
        return ResponseEntity.ok(goalService.getUserGoals());
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<GoalDto> createGoal(@RequestBody GoalDto goalDto) {
        return ResponseEntity.ok(goalService.createGoal(goalDto));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<GoalDto> getGoal(@PathVariable Long id) {
        return ResponseEntity.ok(goalService.getGoal(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<GoalDto> updateGoal(@PathVariable Long id, @RequestBody GoalDto goalDto) {
        return ResponseEntity.ok(goalService.updateGoal(id, goalDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(id);
        return ResponseEntity.ok().build();
    }
}
