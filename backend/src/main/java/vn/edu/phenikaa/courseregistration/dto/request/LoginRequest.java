package vn.edu.phenikaa.courseregistration.dto.request;

import jakarta.validation.constraints.NotBlank;

/**
 * Request dang nhap demo cho do an.
 *
 * <p>Backend chi dinh danh sinh vien bang ma sinh vien. Truong password duoc giu
 * de tuong thich giao dien hien tai, khong duoc luu va khong duoc xem la co che
 * xac thuc mat khau that.</p>
 */
public class LoginRequest {
    @NotBlank(message = "Ma sinh vien khong duoc de trong")
    private String studentId;

    private String password;

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
