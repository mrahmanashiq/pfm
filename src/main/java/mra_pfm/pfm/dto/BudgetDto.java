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
public class BudgetDto {

    private Long id;
    private String name;
    private String description;
    private BigDecimal amount;
    private BigDecimal spent;
    private BigDecimal remaining;
    private String budgetPeriod;
    private LocalDate startDate;
    private LocalDate endDate;
    private String currency;
    private Boolean isActive;
    private Boolean notificationEnabled;
    private Integer alertPercentage;
    private String color;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long userId;
    private Long categoryId;

    private CategoryDto category;
}
