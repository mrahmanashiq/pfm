package mra_pfm.pfm.service;

import lombok.AllArgsConstructor;
import mra_pfm.pfm.dto.UsersDto;
import mra_pfm.pfm.entity.Users;
import mra_pfm.pfm.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;

    public UsersDto saveUser(UsersDto usersDto) {
        try {
            Users user = convertToEntity(usersDto);
            Users savedUser = userRepository.save(user);
            return convertToDto(savedUser);
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private Users convertToEntity(UsersDto usersDto) {
        return Users.builder()
                .id(usersDto.getId())
                .name(usersDto.getName())
                .username(usersDto.getUsername())
                .email(usersDto.getEmail())
                .mobileNumber(usersDto.getMobileNumber())
                .address(usersDto.getAddress())
                .password(usersDto.getPassword())
                .role(usersDto.getRole() != null ? Users.Role.valueOf(usersDto.getRole()) : Users.Role.USER)
                .userType(usersDto.getUserType() != null ? Users.UserType.valueOf(usersDto.getUserType()) : Users.UserType.NORMAL)
                .imageName(usersDto.getImageName())
                .status(usersDto.getStatus() != null ? Users.Status.valueOf(usersDto.getStatus()) : Users.Status.ACTIVE)
                .createdAt(usersDto.getCreatedAt() != null ? new Date(usersDto.getCreatedAt()) : null)
                .updatedAt(usersDto.getUpdatedAt() != null ? new Date(usersDto.getUpdatedAt()) : null)
                .build();
    }

    private UsersDto convertToDto(Users user) {
        return UsersDto.builder()
                .id(user.getId())
                .name(user.getName())
                .username(user.getUsername())
                .email(user.getEmail())
                .mobileNumber(user.getMobileNumber())
                .address(user.getAddress())
                .password(user.getPassword())
                .role(user.getRole().name())
                .userType(user.getUserType().name())
                .imageName(user.getImageName())
                .status(user.getStatus().name())
                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null)
                .updatedAt(user.getUpdatedAt() != null ? user.getUpdatedAt().toString() : null)
                .build();
    }

    public UsersDto getUser(Long id) {
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

    public UsersDto updateUser(UsersDto usersDto) {
        try {
            Users user = convertToEntity(usersDto);
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

    public List<UsersDto> getUsers() {
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
