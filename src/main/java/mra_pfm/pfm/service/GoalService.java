package mra_pfm.pfm.service;

import lombok.RequiredArgsConstructor;
import mra_pfm.pfm.dto.AccountDto;
import mra_pfm.pfm.dto.GoalDto;
import mra_pfm.pfm.entity.Account;
import mra_pfm.pfm.entity.Goal;
import mra_pfm.pfm.entity.Users;
import mra_pfm.pfm.repository.AccountRepository;
import mra_pfm.pfm.repository.GoalRepository;
import mra_pfm.pfm.repository.UserRepository;
import mra_pfm.pfm.security.UserPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository goalRepository;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    private Users getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Account loadOwnedAccount(Long accountId, Users user) {
        if (accountId == null) {
            return null;
        }
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        if (!account.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }
        return account;
    }

    @Transactional(readOnly = true)
    public List<GoalDto> getUserGoals() {
        Users user = getCurrentUser();
        return goalRepository.findAllByUserOrdered(user).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public GoalDto getGoal(Long id) {
        Users user = getCurrentUser();
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));
        if (!goal.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }
        return convertToDto(goal);
    }

    @Transactional
    public GoalDto createGoal(GoalDto dto) {
        Users user = getCurrentUser();
        Account account = loadOwnedAccount(dto.getAccountId(), user);

        BigDecimal target = dto.getTargetAmount();
        BigDecimal current = dto.getCurrentAmount() != null ? dto.getCurrentAmount() : BigDecimal.ZERO;
        boolean achieved = target != null && current.compareTo(target) >= 0;

        Goal goal = Goal.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .targetAmount(target)
                .currentAmount(current)
                .targetDate(dto.getTargetDate())
                .currency(dto.getCurrency() != null ? dto.getCurrency() : "USD")
                .goalType(Goal.GoalType.valueOf(dto.getGoalType()))
                .status(dto.getStatus() != null ? Goal.GoalStatus.valueOf(dto.getStatus()) : (achieved ? Goal.GoalStatus.COMPLETED : Goal.GoalStatus.ACTIVE))
                .isAchieved(achieved)
                .achievedDate(achieved ? LocalDate.now() : null)
                .notificationEnabled(dto.getNotificationEnabled() != null ? dto.getNotificationEnabled() : true)
                .color(dto.getColor())
                .icon(dto.getIcon())
                .user(user)
                .account(account)
                .build();

        return convertToDto(goalRepository.save(goal));
    }

    @Transactional
    public GoalDto updateGoal(Long id, GoalDto dto) {
        Users user = getCurrentUser();
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));
        if (!goal.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        Account account = loadOwnedAccount(dto.getAccountId(), user);
        BigDecimal target = dto.getTargetAmount();
        BigDecimal current = dto.getCurrentAmount() != null ? dto.getCurrentAmount() : goal.getCurrentAmount();
        boolean nowAchieved = target != null && current != null && current.compareTo(target) >= 0;

        goal.setName(dto.getName());
        goal.setDescription(dto.getDescription());
        goal.setTargetAmount(target);
        goal.setCurrentAmount(current);
        goal.setTargetDate(dto.getTargetDate());
        goal.setCurrency(dto.getCurrency());
        goal.setGoalType(Goal.GoalType.valueOf(dto.getGoalType()));
        goal.setStatus(dto.getStatus() != null ? Goal.GoalStatus.valueOf(dto.getStatus()) : goal.getStatus());
        goal.setIsAchieved(nowAchieved);
        if (nowAchieved && goal.getAchievedDate() == null) {
            goal.setAchievedDate(LocalDate.now());
        } else if (!nowAchieved) {
            goal.setAchievedDate(null);
        }
        goal.setNotificationEnabled(dto.getNotificationEnabled());
        goal.setColor(dto.getColor());
        goal.setIcon(dto.getIcon());
        goal.setAccount(account);

        return convertToDto(goalRepository.save(goal));
    }

    @Transactional
    public void deleteGoal(Long id) {
        Users user = getCurrentUser();
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Goal not found"));
        if (!goal.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }
        goalRepository.delete(goal);
    }

    private GoalDto convertToDto(Goal goal) {
        return GoalDto.builder()
                .id(goal.getId())
                .name(goal.getName())
                .description(goal.getDescription())
                .targetAmount(goal.getTargetAmount())
                .currentAmount(goal.getCurrentAmount())
                .targetDate(goal.getTargetDate())
                .currency(goal.getCurrency())
                .goalType(goal.getGoalType().name())
                .status(goal.getStatus().name())
                .isAchieved(goal.getIsAchieved())
                .achievedDate(goal.getAchievedDate())
                .notificationEnabled(goal.getNotificationEnabled())
                .color(goal.getColor())
                .icon(goal.getIcon())
                .createdAt(goal.getCreatedAt())
                .updatedAt(goal.getUpdatedAt())
                .userId(goal.getUser().getId())
                .accountId(goal.getAccount() != null ? goal.getAccount().getId() : null)
                .account(goal.getAccount() != null ? toAccountSummary(goal.getAccount()) : null)
                .build();
    }

    private AccountDto toAccountSummary(Account account) {
        return AccountDto.builder()
                .id(account.getId())
                .name(account.getName())
                .accountType(account.getAccountType().name())
                .currency(account.getCurrency())
                .build();
    }
}
