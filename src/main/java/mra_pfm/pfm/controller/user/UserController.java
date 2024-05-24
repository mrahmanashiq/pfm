package mra_pfm.pfm.controller.user;

import lombok.AllArgsConstructor;
import mra_pfm.pfm.domain.user.User;
import mra_pfm.pfm.service.user.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @GetMapping()
    public Map getUsers() {
        return userService.getUsers();
    }

    @PostMapping("/create")
    public User createUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    @PutMapping("/update")
    public User updateUser(@RequestBody User user) {
        return userService.updateUser(user);
    }

    @DeleteMapping("/delete/{username}")
    public void deleteUser(@PathVariable String username) {
        userService.deleteUser(username);
    }
}
