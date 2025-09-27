package mra_pfm.pfm.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AccountDto {
    
    private Long id;
    private String name;
    private String accountType;
    private BigDecimal balance;
    private BigDecimal initialBalance;
    private String currency;
    private String accountNumber;
    private String bankName;
    private String description;
    private Boolean isActive;
    private Boolean includeInTotal;
    private String color;
    private String icon;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long userId;
}