package mra_pfm.pfm.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignUpRequest {
    
    private String name;
    private String username;
    private String email;
    private String password;
    private String confirmPassword;
    private String mobileNumber;
    private String address;
}