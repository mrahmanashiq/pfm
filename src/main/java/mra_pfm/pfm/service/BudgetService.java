package mra_pfm.pfm.service;

import lombok.RequiredArgsConstructor;
import mra_pfm.pfm.dto.BudgetDto;
import mra_pfm.pfm.dto.CategoryDto;
import mra_pfm.pfm.entity.Budget;
import mra_pfm.pfm.entity.Category;
import mra_pfm.pfm.entity.Users;
import mra_pfm.pfm.repository.BudgetRepository;
import mra_pfm.pfm.repository.CategoryRepository;
import mra_pfm.pfm.repository.UserRepository;
import mra_pfm.pfm.security.UserPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    private Users getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Category loadCategoryIfAccessible(Long categoryId, Users user) {
        if (categoryId == null) {
            return null;
        }
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        boolean ownedByUser = category.getUser() != null && category.getUser().getId().equals(user.getId());
        boolean systemCategory = Boolean.TRUE.equals(category.getIsSystemCategory());
        if (!ownedByUser && !systemCategory) {
            throw new RuntimeException("Access denied");
        }
        return category;
    }

    @Transactional(readOnly = true)
    public List<BudgetDto> getUserBudgets() {
        Users user = getCurrentUser();
        return budgetRepository.findAllByUserOrdered(user).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BudgetDto getBudget(Long id) {
        Users user = getCurrentUser();
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        if (!budget.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }
        return convertToDto(budget);
    }

    @Transactional
    public BudgetDto createBudget(BudgetDto dto) {
        Users user = getCurrentUser();
        Category category = loadCategoryIfAccessible(dto.getCategoryId(), user);

        BigDecimal amount = dto.getAmount();
        BigDecimal spent = dto.getSpent() != null ? dto.getSpent() : BigDecimal.ZERO;

        Budget budget = Budget.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .amount(amount)
                .spent(spent)
                .remaining(amount != null ? amount.subtract(spent) : BigDecimal.ZERO)
                .budgetPeriod(Budget.BudgetPeriod.valueOf(dto.getBudgetPeriod()))
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .currency(dto.getCurrency() != null ? dto.getCurrency() : "USD")
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .notificationEnabled(dto.getNotificationEnabled() != null ? dto.getNotificationEnabled() : true)
                .alertPercentage(dto.getAlertPercentage() != null ? dto.getAlertPercentage() : 80)
                .color(dto.getColor())
                .user(user)
                .category(category)
                .build();

        return convertToDto(budgetRepository.save(budget));
    }

    @Transactional
    public BudgetDto updateBudget(Long id, BudgetDto dto) {
        Users user = getCurrentUser();
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        if (!budget.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        Category category = loadCategoryIfAccessible(dto.getCategoryId(), user);
        BigDecimal amount = dto.getAmount();
        BigDecimal spent = dto.getSpent() != null ? dto.getSpent() : budget.getSpent();

        budget.setName(dto.getName());
        budget.setDescription(dto.getDescription());
        budget.setAmount(amount);
        budget.setSpent(spent);
        budget.setRemaining(amount != null ? amount.subtract(spent != null ? spent : BigDecimal.ZERO) : BigDecimal.ZERO);
        budget.setBudgetPeriod(Budget.BudgetPeriod.valueOf(dto.getBudgetPeriod()));
        budget.setStartDate(dto.getStartDate());
        budget.setEndDate(dto.getEndDate());
        budget.setCurrency(dto.getCurrency());
        budget.setIsActive(dto.getIsActive());
        budget.setNotificationEnabled(dto.getNotificationEnabled());
        budget.setAlertPercentage(dto.getAlertPercentage());
        budget.setColor(dto.getColor());
        budget.setCategory(category);

        return convertToDto(budgetRepository.save(budget));
    }

    @Transactional
    public void deleteBudget(Long id) {
        Users user = getCurrentUser();
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        if (!budget.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }
        budgetRepository.delete(budget);
    }

    private BudgetDto convertToDto(Budget budget) {
        return BudgetDto.builder()
                .id(budget.getId())
                .name(budget.getName())
                .description(budget.getDescription())
                .amount(budget.getAmount())
                .spent(budget.getSpent())
                .remaining(budget.getRemaining())
                .budgetPeriod(budget.getBudgetPeriod().name())
                .startDate(budget.getStartDate())
                .endDate(budget.getEndDate())
                .currency(budget.getCurrency())
                .isActive(budget.getIsActive())
                .notificationEnabled(budget.getNotificationEnabled())
                .alertPercentage(budget.getAlertPercentage())
                .color(budget.getColor())
                .createdAt(budget.getCreatedAt())
                .updatedAt(budget.getUpdatedAt())
                .userId(budget.getUser().getId())
                .categoryId(budget.getCategory() != null ? budget.getCategory().getId() : null)
                .category(budget.getCategory() != null ? toCategorySummary(budget.getCategory()) : null)
                .build();
    }

    private CategoryDto toCategorySummary(Category category) {
        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .categoryType(category.getCategoryType().name())
                .color(category.getColor())
                .icon(category.getIcon())
                .build();
    }
}
