package mra_pfm.pfm.repository;

import mra_pfm.pfm.entity.Budget;
import mra_pfm.pfm.entity.Category;
import mra_pfm.pfm.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    List<Budget> findByUser(Users user);

    List<Budget> findByUserAndIsActive(Users user, Boolean isActive);

    List<Budget> findByCategory(Category category);

    @Query("SELECT b FROM Budget b WHERE b.user = :user AND b.isActive = true AND b.startDate <= :date AND b.endDate >= :date ORDER BY b.startDate DESC")
    List<Budget> findCurrentBudgetsByUser(@Param("user") Users user, @Param("date") LocalDate date);

    @Query("SELECT b FROM Budget b WHERE b.user = :user ORDER BY b.startDate DESC, b.createdAt DESC")
    List<Budget> findAllByUserOrdered(@Param("user") Users user);
}
