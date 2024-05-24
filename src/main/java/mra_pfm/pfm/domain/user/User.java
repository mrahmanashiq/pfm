package mra_pfm.pfm.domain.user;

import lombok.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private String name;
    private String username;
    private String email;
    private String mobileNumber;
    private String password;
    private String role;
}
