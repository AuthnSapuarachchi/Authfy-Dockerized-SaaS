package com.authn.authfy.service;

import com.authn.authfy.io.ProfileRequest;
import com.authn.authfy.io.ProfileResponse;

public interface ProfileService {

    ProfileResponse createProfile(ProfileRequest request);

    ProfileResponse getProfileByEmail(String email);

    void sendResetOtp(String email);

    void verifyResetOtp(String email, String otp);

    void resetPassword(String email, String otp, String newPassword);

    void sendOtp(String email);

    void verifyOtp(String email, String otp);

}
