package com.devmountain.courseScheduler.dtos;

import com.devmountain.courseScheduler.entities.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private Long id;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private Integer permission;

    public UserDto(User user) {
        if (user.getId() != null) {
            this.id = user.getId();
        }
        if (user.getEmail() != null) {
            this.email = user.getEmail();
        }
        if (user.getPassword() != null) {
            this.password = user.getPassword();
        }
        if (user.getFirstName() != null) {
            this.firstName = user.getFirstName();
        }
        if (user.getLastName() != null) {
            this.lastName = user.getLastName();
        }
        if (user.getPermission() != null) {
            this.permission = user.getPermission();
        }
    }
}
