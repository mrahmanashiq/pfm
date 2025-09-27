package mra_pfm.pfm.repository;

import mra_pfm.pfm.entity.Transaction;
import mra_pfm.pfm.entity.Users;
import mra_pfm.pfm.entity.Account;
import mra_pfm.pfm.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    List<Transaction> findByUser(Users user);
    
    List<Transaction> findByAccount(Account account);
    
    List<Transaction> findByCategory(Category category);
    
    List<Transaction> findByUserAndTransactionType(Users user, Transaction.TransactionType transactionType);
    
    List<Transaction> findByUserAndTransactionDateBetween(Users user, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT t FROM Transaction t WHERE t.user = :user AND t.transactionDate >= :startDate AND t.transactionDate <= :endDate ORDER BY t.transactionDate DESC")
    List<Transaction> findTransactionsByUserAndDateRange(@Param("user") Users user, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user = :user AND t.transactionType = :transactionType AND t.transactionDate >= :startDate AND t.transactionDate <= :endDate")
    BigDecimal getTotalByUserAndTypeAndDateRange(@Param("user") Users user, @Param("transactionType") Transaction.TransactionType transactionType, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT t FROM Transaction t WHERE t.user = :user ORDER BY t.transactionDate DESC, t.createdAt DESC")
    List<Transaction> findRecentTransactionsByUser(@Param("user") Users user);
    
    @Query("SELECT t FROM Transaction t WHERE t.isRecurring = true AND t.nextRecurrenceDate <= :date")
    List<Transaction> findDueRecurringTransactions(@Param("date") LocalDate date);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.user = :user AND t.transactionDate >= :startDate AND t.transactionDate <= :endDate")
    Long countTransactionsByUserAndDateRange(@Param("user") Users user, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}