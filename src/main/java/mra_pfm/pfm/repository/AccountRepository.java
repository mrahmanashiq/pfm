package mra_pfm.pfm.repository;

import mra_pfm.pfm.entity.Account;
import mra_pfm.pfm.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    
    List<Account> findByUser(Users user);
    
    List<Account> findByUserAndIsActive(Users user, Boolean isActive);
    
    List<Account> findByUserAndAccountType(Users user, Account.AccountType accountType);
    
    @Query("SELECT SUM(a.balance) FROM Account a WHERE a.user = :user AND a.isActive = true AND a.includeInTotal = true")
    BigDecimal getTotalBalanceByUser(@Param("user") Users user);
    
    @Query("SELECT a FROM Account a WHERE a.user = :user AND a.isActive = true ORDER BY a.createdAt DESC")
    List<Account> findActiveAccountsByUser(@Param("user") Users user);
    
    @Query("SELECT COUNT(a) FROM Account a WHERE a.user = :user AND a.isActive = true")
    Long countActiveAccountsByUser(@Param("user") Users user);
}