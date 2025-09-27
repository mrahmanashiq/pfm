package mra_pfm.pfm.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserProfileDto {
    
    private Long id;
    private String displayName;
    private String gender;
    private String imageUrl;
    private String about;
    private LocalDate dateOfBirth;
    private String occupation;
    private String company;
    private String phoneNumber;
    private String city;
    private String country;
    private String defaultCurrency;
    private Boolean notificationEnabled;
    private Boolean darkModeEnabled;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}