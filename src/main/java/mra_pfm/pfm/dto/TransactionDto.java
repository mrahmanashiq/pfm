package mra_pfm.pfm.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TransactionDto {
    
    private Long id;
    private BigDecimal amount;
    private String transactionType;
    private String description;
    private LocalDate transactionDate;
    private String currency;
    private String reference;
    private String notes;
    private String location;
    private Boolean isRecurring;
    private String recurrenceType;
    private Integer recurrenceInterval;
    private LocalDate nextRecurrenceDate;
    private Boolean isVerified;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long userId;
    private Long accountId;
    private Long categoryId;
    private Long transferAccountId;
    
    // Nested objects for display
    private AccountDto account;
    private CategoryDto category;
    private AccountDto transferAccount;
}