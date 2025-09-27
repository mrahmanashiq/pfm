package mra_pfm.pfm.repository;

import mra_pfm.pfm.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Users, Long> {
    
    Optional<Users> findByUsername(String username);
    
    Optional<Users> findByEmail(String email);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    List<Users> findByStatus(Users.Status status);
    
    List<Users> findByRole(Users.Role role);
    
    @Query("SELECT u FROM Users u WHERE u.username = :username OR u.email = :email")
    Optional<Users> findByUsernameOrEmail(@Param("username") String username, @Param("email") String email);
    
    @Query("SELECT u FROM Users u WHERE u.status = 'ACTIVE' AND u.emailVerified = true")
    List<Users> findActiveVerifiedUsers();
}