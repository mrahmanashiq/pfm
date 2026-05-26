package mra_pfm.pfm.controller;

import lombok.RequiredArgsConstructor;
import mra_pfm.pfm.dto.BudgetDto;
import mra_pfm.pfm.service.BudgetService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/budgets")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class BudgetController {

    private final BudgetService budgetService;

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<BudgetDto>> getUserBudgets() {
        return ResponseEntity.ok(budgetService.getUserBudgets());
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<BudgetDto> createBudget(@RequestBody BudgetDto budgetDto) {
        return ResponseEntity.ok(budgetService.createBudget(budgetDto));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<BudgetDto> getBudget(@PathVariable Long id) {
        return ResponseEntity.ok(budgetService.getBudget(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<BudgetDto> updateBudget(@PathVariable Long id, @RequestBody BudgetDto budgetDto) {
        return ResponseEntity.ok(budgetService.updateBudget(id, budgetDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.ok().build();
    }
}
