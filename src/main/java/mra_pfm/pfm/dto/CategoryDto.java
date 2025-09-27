package mra_pfm.pfm.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CategoryDto {
    
    private Long id;
    private String name;
    private String description;
    private String categoryType;
    private String color;
    private String icon;
    private Boolean isActive;
    private Boolean isSystemCategory;
    private Integer sortOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long userId;
    private Long parentCategoryId;
    
    // Nested objects
    private CategoryDto parentCategory;
    private List<CategoryDto> subCategories;
}