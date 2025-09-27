package mra_pfm.pfm.service;

import lombok.RequiredArgsConstructor;
import mra_pfm.pfm.dto.AccountDto;
import mra_pfm.pfm.entity.Account;
import mra_pfm.pfm.entity.Users;
import mra_pfm.pfm.repository.AccountRepository;
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
public class AccountService {
    
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    
    private Users getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    @Transactional(readOnly = true)
    public List<AccountDto> getUserAccounts() {
        Users user = getCurrentUser();
        List<Account> accounts = accountRepository.findByUser(user);
        return accounts.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public AccountDto createAccount(AccountDto accountDto) {
        Users user = getCurrentUser();
        
        Account account = Account.builder()
                .name(accountDto.getName())
                .accountType(Account.AccountType.valueOf(accountDto.getAccountType()))
                .balance(accountDto.getBalance() != null ? accountDto.getBalance() : BigDecimal.ZERO)
                .initialBalance(accountDto.getInitialBalance() != null ? accountDto.getInitialBalance() : BigDecimal.ZERO)
                .currency(accountDto.getCurrency() != null ? accountDto.getCurrency() : "USD")
                .accountNumber(accountDto.getAccountNumber())
                .bankName(accountDto.getBankName())
                .description(accountDto.getDescription())
                .isActive(accountDto.getIsActive() != null ? accountDto.getIsActive() : true)
                .includeInTotal(accountDto.getIncludeInTotal() != null ? accountDto.getIncludeInTotal() : true)
                .color(accountDto.getColor())
                .icon(accountDto.getIcon())
                .user(user)
                .build();
        
        Account savedAccount = accountRepository.save(account);
        return convertToDto(savedAccount);
    }
    
    @Transactional(readOnly = true)
    public AccountDto getAccount(Long id) {
        Users user = getCurrentUser();
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        if (!account.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }
        
        return convertToDto(account);
    }
    
    @Transactional
    public AccountDto updateAccount(Long id, AccountDto accountDto) {
        Users user = getCurrentUser();
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        if (!account.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }
        
        account.setName(accountDto.getName());
        account.setAccountType(Account.AccountType.valueOf(accountDto.getAccountType()));
        account.setBalance(accountDto.getBalance());
        account.setInitialBalance(accountDto.getInitialBalance());
        account.setCurrency(accountDto.getCurrency());
        account.setAccountNumber(accountDto.getAccountNumber());
        account.setBankName(accountDto.getBankName());
        account.setDescription(accountDto.getDescription());
        account.setIsActive(accountDto.getIsActive());
        account.setIncludeInTotal(accountDto.getIncludeInTotal());
        account.setColor(accountDto.getColor());
        account.setIcon(accountDto.getIcon());
        
        Account updatedAccount = accountRepository.save(account);
        return convertToDto(updatedAccount);
    }
    
    @Transactional
    public void deleteAccount(Long id) {
        Users user = getCurrentUser();
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        if (!account.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }
        
        accountRepository.delete(account);
    }
    
    private AccountDto convertToDto(Account account) {
        return AccountDto.builder()
                .id(account.getId())
                .name(account.getName())
                .accountType(account.getAccountType().name())
                .balance(account.getBalance())
                .initialBalance(account.getInitialBalance())
                .currency(account.getCurrency())
                .accountNumber(account.getAccountNumber())
                .bankName(account.getBankName())
                .description(account.getDescription())
                .isActive(account.getIsActive())
                .includeInTotal(account.getIncludeInTotal())
                .color(account.getColor())
                .icon(account.getIcon())
                .createdAt(account.getCreatedAt())
                .updatedAt(account.getUpdatedAt())
                .userId(account.getUser().getId())
                .build();
    }
}