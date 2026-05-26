package mra_pfm.pfm.service;

import lombok.RequiredArgsConstructor;
import mra_pfm.pfm.dto.CategoryDto;
import mra_pfm.pfm.entity.Category;
import mra_pfm.pfm.entity.Users;
import mra_pfm.pfm.repository.CategoryRepository;
import mra_pfm.pfm.repository.UserRepository;
import mra_pfm.pfm.security.UserPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    private Users getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> getUserCategories() {
        Users user = getCurrentUser();
        return categoryRepository.findActiveCategoriesForUser(user).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryDto getCategory(Long id) {
        Users user = getCurrentUser();
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        assertAccess(category, user);
        return convertToDto(category);
    }

    @Transactional
    public CategoryDto createCategory(CategoryDto dto) {
        Users user = getCurrentUser();
        Category parent = null;
        if (dto.getParentCategoryId() != null) {
            parent = categoryRepository.findById(dto.getParentCategoryId())
                    .orElseThrow(() -> new RuntimeException("Parent category not found"));
            assertAccess(parent, user);
        }

        Category category = Category.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .categoryType(Category.CategoryType.valueOf(dto.getCategoryType()))
                .color(dto.getColor())
                .icon(dto.getIcon())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .isSystemCategory(false)
                .sortOrder(dto.getSortOrder() != null ? dto.getSortOrder() : 0)
                .user(user)
                .parentCategory(parent)
                .build();

        return convertToDto(categoryRepository.save(category));
    }

    @Transactional
    public CategoryDto updateCategory(Long id, CategoryDto dto) {
        Users user = getCurrentUser();
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        assertOwned(category, user);

        Category parent = null;
        if (dto.getParentCategoryId() != null) {
            if (dto.getParentCategoryId().equals(id)) {
                throw new RuntimeException("Category cannot be its own parent");
            }
            parent = categoryRepository.findById(dto.getParentCategoryId())
                    .orElseThrow(() -> new RuntimeException("Parent category not found"));
            assertAccess(parent, user);
        }

        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        category.setCategoryType(Category.CategoryType.valueOf(dto.getCategoryType()));
        category.setColor(dto.getColor());
        category.setIcon(dto.getIcon());
        category.setIsActive(dto.getIsActive());
        category.setSortOrder(dto.getSortOrder());
        category.setParentCategory(parent);

        return convertToDto(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long id) {
        Users user = getCurrentUser();
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        assertOwned(category, user);
        categoryRepository.delete(category);
    }

    private void assertAccess(Category category, Users user) {
        boolean ownedByUser = category.getUser() != null && category.getUser().getId().equals(user.getId());
        boolean systemCategory = Boolean.TRUE.equals(category.getIsSystemCategory());
        if (!ownedByUser && !systemCategory) {
            throw new RuntimeException("Access denied");
        }
    }

    private void assertOwned(Category category, Users user) {
        if (category.getUser() == null || !category.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }
    }

    private CategoryDto convertToDto(Category category) {
        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .categoryType(category.getCategoryType().name())
                .color(category.getColor())
                .icon(category.getIcon())
                .isActive(category.getIsActive())
                .isSystemCategory(category.getIsSystemCategory())
                .sortOrder(category.getSortOrder())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .userId(category.getUser() != null ? category.getUser().getId() : null)
                .parentCategoryId(category.getParentCategory() != null ? category.getParentCategory().getId() : null)
                .build();
    }
}
