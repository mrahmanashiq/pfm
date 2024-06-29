package mra_pfm.pfm.controller;

import lombok.AllArgsConstructor;
import mra_pfm.pfm.dto.UsersDto;
import mra_pfm.pfm.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    @PostMapping("/create")
    public UsersDto createUser(@RequestBody UsersDto usersDto) {
        return userService.saveUser(usersDto);
    }

    @GetMapping()
    public List<UsersDto> getUsers() {
        return userService.getUsers();
    }

    @GetMapping("/{id}")
    public UsersDto getUser(@PathVariable Long id) {
        return userService.getUser(id);
    }

    @PutMapping("/update")
    public UsersDto updateUser(@RequestBody UsersDto usersDto) {
        return userService.updateUser(usersDto);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
