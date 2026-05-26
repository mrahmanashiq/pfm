package mra_pfm.pfm.repository;

import mra_pfm.pfm.entity.Goal;
import mra_pfm.pfm.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {

    List<Goal> findByUser(Users user);

    List<Goal> findByUserAndStatus(Users user, Goal.GoalStatus status);

    List<Goal> findByUserAndGoalType(Users user, Goal.GoalType goalType);

    @Query("SELECT g FROM Goal g WHERE g.user = :user ORDER BY g.targetDate ASC NULLS LAST, g.createdAt DESC")
    List<Goal> findAllByUserOrdered(@Param("user") Users user);
}
