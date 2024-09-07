package mra_pfm.pfm.repository;

import mra_pfm.pfm.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<Users, Long> {
}
