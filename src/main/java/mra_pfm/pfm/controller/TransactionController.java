package mra_pfm.pfm.controller;

import lombok.RequiredArgsConstructor;
import mra_pfm.pfm.dto.TransactionDto;
import mra_pfm.pfm.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<TransactionDto>> getUserTransactions() {
        return ResponseEntity.ok(transactionService.getUserTransactions());
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TransactionDto> createTransaction(@RequestBody TransactionDto transactionDto) {
        return ResponseEntity.ok(transactionService.createTransaction(transactionDto));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TransactionDto> getTransaction(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.getTransaction(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<TransactionDto> updateTransaction(@PathVariable Long id, @RequestBody TransactionDto transactionDto) {
        return ResponseEntity.ok(transactionService.updateTransaction(id, transactionDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.ok().build();
    }
}
