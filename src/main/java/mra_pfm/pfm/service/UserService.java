package mra_pfm.pfm.service;

import lombok.AllArgsConstructor;
import lombok.Builder;
import mra_pfm.pfm.dto.UserDTO;
import mra_pfm.pfm.entity.Users;
import mra_pfm.pfm.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
@Builder
public class UserService {

    private final UserRepository userRepository;

    public UserDTO saveUser(UserDTO userDTO) {
        try {
            Users user = convertToEntity(userDTO);
            Users savedUser = userRepository.save(user);
            return convertToDto(savedUser);
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private Users convertToEntity(UserDTO userDTO) {
        return Users.builder()
                .id(userDTO.getId())
                .name(userDTO.getName())
                .username(userDTO.getUsername())
                .email(userDTO.getEmail())
                .phone(userDTO.getPhone())
                .address(userDTO.getAddress())
                .build();
    }


    private UserDTO convertToDto(Users user) {
        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .username(user.getUsername())
                .email(user.getEmail())
                .phone(user.getPhone())
                .address(user.getAddress())
                .build();
    }

    public UserDTO getUser(Long id) {
        try {
            Users user = userRepository.findById(id).orElse(null);
            if (user != null) {
                return convertToDto(user);
            }
            else {
                return null;
            }
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public UserDTO updateUser(UserDTO userDTO) {
        try {
            Users user = convertToEntity(userDTO);
            Users updatedUser = userRepository.save(user);
            return convertToDto(updatedUser);
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public void deleteUser(Long id) {
        try {
            userRepository.deleteById(id);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<UserDTO> getUsers() {
        try {
            List<Users> users = userRepository.findAll();
            return users.stream().map(this::convertToDto).collect(Collectors.toList());
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
