package mra_pfm.pfm.service.user;

import mra_pfm.pfm.domain.user.User;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {

    List<User> users = new ArrayList<>(
            Arrays.asList(
                    new User("John Doe", "john.doe", "jhon@gmail.com", "1234567890", "password", "admin"),
                    new User("Jane Doe", "jane.doe", "jane@gmail.com", "1234567891", "password", "user")
            )
    );

    public Map getUsers() {
        Map<String, List<User>> response = new HashMap<>();
        response.put("data", users);
        return response;
    }

    public User saveUser(User user) {
        boolean isUserInfoValid = this.isUserInformationValid(user);
        if (isUserInfoValid) {
            this.checkIfUserAlreadyExists(user);
            this.makeUserInfoReadyForSave(user);
            users.add(user);
            return user;
        }

        return null;
    }

    public User updateUser(User user) {
        return null;
    }

    public void deleteUser(String username) {
        for (User user : users) {
            if (user.getUsername().equals(username)) {
                users.remove(user);
                break;
            }
        }
    }

    private boolean isUserInformationValid(User user) {
        if (user.getName() == null || user.getName().isEmpty()) {
            throw new IllegalArgumentException("Name is required");
        }
        if (user.getUsername() == null || user.getUsername().isEmpty()) {
            throw new IllegalArgumentException("Username is required");
        }
        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (user.getMobileNumber() == null || user.getMobileNumber().length() != 10) {
            throw new IllegalArgumentException("Mobile number is required");
        }
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (user.getRole() == null || user.getRole().isEmpty()) {
            throw new IllegalArgumentException("Role is required");
        }
        return true;
    }

    private void makeUserInfoReadyForSave(User user) {
        user.setName(user.getName().trim());
        user.setUsername(user.getUsername().trim());
        user.setEmail(user.getEmail().trim());
        user.setPassword(user.getPassword().trim());
        user.setRole(user.getRole().trim());
    }

    private void checkIfUserAlreadyExists(User user) {
        for (User existingUser : users) {
            if (existingUser.getUsername().equals(user.getUsername())) {
                throw new IllegalArgumentException("User already exists with the same username");
            }
            if (existingUser.getEmail().equals(user.getEmail())) {
                throw new IllegalArgumentException("User already exists with the same email");
            }
            if (existingUser.getMobileNumber().equals(user.getMobileNumber())) {
                throw new IllegalArgumentException("User already exists with the same mobile number");
            }
        }
    }
}
