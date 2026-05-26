package mra_pfm.pfm.service;

import lombok.RequiredArgsConstructor;
import mra_pfm.pfm.dto.AccountDto;
import mra_pfm.pfm.dto.CategoryDto;
import mra_pfm.pfm.dto.TransactionDto;
import mra_pfm.pfm.entity.Account;
import mra_pfm.pfm.entity.Category;
import mra_pfm.pfm.entity.Transaction;
import mra_pfm.pfm.entity.Users;
import mra_pfm.pfm.repository.AccountRepository;
import mra_pfm.pfm.repository.CategoryRepository;
import mra_pfm.pfm.repository.TransactionRepository;
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
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    private Users getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Account loadOwnedAccount(Long accountId, Users user) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        if (!account.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }
        return account;
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
    public List<TransactionDto> getUserTransactions() {
        Users user = getCurrentUser();
        return transactionRepository.findRecentTransactionsByUser(user).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TransactionDto getTransaction(Long id) {
        Users user = getCurrentUser();
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }
        return convertToDto(transaction);
    }

    @Transactional
    public TransactionDto createTransaction(TransactionDto dto) {
        Users user = getCurrentUser();
        Account account = loadOwnedAccount(dto.getAccountId(), user);
        Category category = loadCategoryIfAccessible(dto.getCategoryId(), user);
        Account transferAccount = dto.getTransferAccountId() != null
                ? loadOwnedAccount(dto.getTransferAccountId(), user)
                : null;

        Transaction.TransactionType type = Transaction.TransactionType.valueOf(dto.getTransactionType());

        Transaction transaction = Transaction.builder()
                .amount(dto.getAmount())
                .transactionType(type)
                .description(dto.getDescription())
                .transactionDate(dto.getTransactionDate())
                .currency(dto.getCurrency() != null ? dto.getCurrency() : account.getCurrency())
                .reference(dto.getReference())
                .notes(dto.getNotes())
                .location(dto.getLocation())
                .isRecurring(dto.getIsRecurring() != null ? dto.getIsRecurring() : false)
                .recurrenceType(dto.getRecurrenceType() != null ? Transaction.RecurrenceType.valueOf(dto.getRecurrenceType()) : null)
                .recurrenceInterval(dto.getRecurrenceInterval())
                .nextRecurrenceDate(dto.getNextRecurrenceDate())
                .isVerified(dto.getIsVerified() != null ? dto.getIsVerified() : false)
                .user(user)
                .account(account)
                .category(category)
                .transferAccount(transferAccount)
                .build();

        applyBalanceChange(transaction, type, transaction.getAmount());

        Transaction saved = transactionRepository.save(transaction);
        accountRepository.save(account);
        if (transferAccount != null) {
            accountRepository.save(transferAccount);
        }
        return convertToDto(saved);
    }

    @Transactional
    public TransactionDto updateTransaction(Long id, TransactionDto dto) {
        Users user = getCurrentUser();
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        Account originalAccount = transaction.getAccount();
        Account originalTransferAccount = transaction.getTransferAccount();
        BigDecimal originalAmount = transaction.getAmount();
        Transaction.TransactionType originalType = transaction.getTransactionType();

        revertBalanceChange(originalType, originalAmount, originalAccount, originalTransferAccount);

        Account account = loadOwnedAccount(dto.getAccountId(), user);
        Category category = loadCategoryIfAccessible(dto.getCategoryId(), user);
        Account transferAccount = dto.getTransferAccountId() != null
                ? loadOwnedAccount(dto.getTransferAccountId(), user)
                : null;
        Transaction.TransactionType type = Transaction.TransactionType.valueOf(dto.getTransactionType());

        transaction.setAmount(dto.getAmount());
        transaction.setTransactionType(type);
        transaction.setDescription(dto.getDescription());
        transaction.setTransactionDate(dto.getTransactionDate());
        transaction.setCurrency(dto.getCurrency() != null ? dto.getCurrency() : account.getCurrency());
        transaction.setReference(dto.getReference());
        transaction.setNotes(dto.getNotes());
        transaction.setLocation(dto.getLocation());
        transaction.setIsRecurring(dto.getIsRecurring());
        transaction.setRecurrenceType(dto.getRecurrenceType() != null ? Transaction.RecurrenceType.valueOf(dto.getRecurrenceType()) : null);
        transaction.setRecurrenceInterval(dto.getRecurrenceInterval());
        transaction.setNextRecurrenceDate(dto.getNextRecurrenceDate());
        transaction.setIsVerified(dto.getIsVerified());
        transaction.setAccount(account);
        transaction.setCategory(category);
        transaction.setTransferAccount(transferAccount);

        applyBalanceChange(transaction, type, dto.getAmount());

        Transaction updated = transactionRepository.save(transaction);
        accountRepository.save(account);
        if (transferAccount != null) {
            accountRepository.save(transferAccount);
        }
        if (!originalAccount.getId().equals(account.getId())) {
            accountRepository.save(originalAccount);
        }
        if (originalTransferAccount != null && (transferAccount == null || !originalTransferAccount.getId().equals(transferAccount.getId()))) {
            accountRepository.save(originalTransferAccount);
        }
        return convertToDto(updated);
    }

    @Transactional
    public void deleteTransaction(Long id) {
        Users user = getCurrentUser();
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }
        revertBalanceChange(transaction.getTransactionType(), transaction.getAmount(),
                transaction.getAccount(), transaction.getTransferAccount());
        accountRepository.save(transaction.getAccount());
        if (transaction.getTransferAccount() != null) {
            accountRepository.save(transaction.getTransferAccount());
        }
        transactionRepository.delete(transaction);
    }

    private void applyBalanceChange(Transaction transaction, Transaction.TransactionType type, BigDecimal amount) {
        Account account = transaction.getAccount();
        Account transferAccount = transaction.getTransferAccount();
        if (type == Transaction.TransactionType.INCOME) {
            account.setBalance(account.getBalance().add(amount));
        } else if (type == Transaction.TransactionType.EXPENSE) {
            account.setBalance(account.getBalance().subtract(amount));
        } else if (type == Transaction.TransactionType.TRANSFER && transferAccount != null) {
            account.setBalance(account.getBalance().subtract(amount));
            transferAccount.setBalance(transferAccount.getBalance().add(amount));
        }
    }

    private void revertBalanceChange(Transaction.TransactionType type, BigDecimal amount,
                                     Account account, Account transferAccount) {
        if (type == Transaction.TransactionType.INCOME) {
            account.setBalance(account.getBalance().subtract(amount));
        } else if (type == Transaction.TransactionType.EXPENSE) {
            account.setBalance(account.getBalance().add(amount));
        } else if (type == Transaction.TransactionType.TRANSFER && transferAccount != null) {
            account.setBalance(account.getBalance().add(amount));
            transferAccount.setBalance(transferAccount.getBalance().subtract(amount));
        }
    }

    private TransactionDto convertToDto(Transaction transaction) {
        return TransactionDto.builder()
                .id(transaction.getId())
                .amount(transaction.getAmount())
                .transactionType(transaction.getTransactionType().name())
                .description(transaction.getDescription())
                .transactionDate(transaction.getTransactionDate())
                .currency(transaction.getCurrency())
                .reference(transaction.getReference())
                .notes(transaction.getNotes())
                .location(transaction.getLocation())
                .isRecurring(transaction.getIsRecurring())
                .recurrenceType(transaction.getRecurrenceType() != null ? transaction.getRecurrenceType().name() : null)
                .recurrenceInterval(transaction.getRecurrenceInterval())
                .nextRecurrenceDate(transaction.getNextRecurrenceDate())
                .isVerified(transaction.getIsVerified())
                .createdAt(transaction.getCreatedAt())
                .updatedAt(transaction.getUpdatedAt())
                .userId(transaction.getUser().getId())
                .accountId(transaction.getAccount().getId())
                .categoryId(transaction.getCategory() != null ? transaction.getCategory().getId() : null)
                .transferAccountId(transaction.getTransferAccount() != null ? transaction.getTransferAccount().getId() : null)
                .account(toAccountSummary(transaction.getAccount()))
                .category(toCategorySummary(transaction.getCategory()))
                .transferAccount(toAccountSummary(transaction.getTransferAccount()))
                .build();
    }

    private AccountDto toAccountSummary(Account account) {
        if (account == null) {
            return null;
        }
        return AccountDto.builder()
                .id(account.getId())
                .name(account.getName())
                .accountType(account.getAccountType().name())
                .currency(account.getCurrency())
                .build();
    }

    private CategoryDto toCategorySummary(Category category) {
        if (category == null) {
            return null;
        }
        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .categoryType(category.getCategoryType().name())
                .color(category.getColor())
                .icon(category.getIcon())
                .build();
    }
}
