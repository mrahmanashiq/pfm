package mra_pfm.pfm.repository;

import mra_pfm.pfm.entity.Category;
import mra_pfm.pfm.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    List<Category> findByUser(Users user);
    
    List<Category> findByUserAndCategoryType(Users user, Category.CategoryType categoryType);
    
    List<Category> findByUserAndIsActive(Users user, Boolean isActive);
    
    List<Category> findByIsSystemCategory(Boolean isSystemCategory);
    
    List<Category> findByUserAndParentCategory(Users user, Category parentCategory);
    
    @Query("SELECT c FROM Category c WHERE c.user = :user AND c.parentCategory IS NULL ORDER BY c.sortOrder, c.name")
    List<Category> findParentCategoriesByUser(@Param("user") Users user);
    
    @Query("SELECT c FROM Category c WHERE (c.user = :user OR c.isSystemCategory = true) AND c.isActive = true ORDER BY c.categoryType, c.sortOrder, c.name")
    List<Category> findActiveCategoriesForUser(@Param("user") Users user);
    
    @Query("SELECT c FROM Category c WHERE c.parentCategory = :parent ORDER BY c.sortOrder, c.name")
    List<Category> findSubCategories(@Param("parent") Category parent);
}