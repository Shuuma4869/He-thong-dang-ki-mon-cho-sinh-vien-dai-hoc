package vn.edu.phenikaa.courseregistration.model;

/**
 * Lớp cha dùng chung cho các loại người dùng trong hệ thống.
 *
 * <p>User chỉ giữ thông tin định danh chung. Các thuộc tính hoặc hành vi riêng
 * của sinh viên, giảng viên, quản trị viên phải được đặt ở lớp con tương ứng.</p>
 */
public abstract class User {
    private String id;
    private String fullName;

    protected User() {
    }

    protected User(String id, String fullName) {
        this.id = id;
        this.fullName = fullName;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
}
