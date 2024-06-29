package mra_pfm.pfm;

import mra_pfm.pfm.entity.UserProfile;
import mra_pfm.pfm.entity.Users;
import mra_pfm.pfm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Date;

@SpringBootApplication
public class PfmApplication implements CommandLineRunner {

	@Autowired
	private UserRepository userRepository;
	public static void main(String[] args) {
		SpringApplication.run(PfmApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		UserProfile userProfile = UserProfile.builder()
				.displayName("John")
				.gender(UserProfile.Gender.MALE)
				.imageUrl("https://example.com/johndoe.jpg")
				.about("I am a software developer.")
				.dateOfBirth(new Date())
				.build();

		Users user = Users.builder()
				.name("John Doe")
				.username("johndoe")
				.email("jhone@gmail.com")
				.mobileNumber("1234567890")
				.address("123, ABC Street, XYZ City")
				.password("password")
				.role(Users.Role.USER)
				.userType(Users.UserType.NORMAL)
				.status(Users.Status.ACTIVE)
				.userProfile(userProfile)
				.build();

		user.setUserProfile(userProfile);
		userRepository.save(user);
	}
}
