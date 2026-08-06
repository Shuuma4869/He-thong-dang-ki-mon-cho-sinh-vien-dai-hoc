package vn.edu.phenikaa.courseregistration.model;

/** Lớp cơ sở thể hiện kế thừa cho người dùng trong hệ thống. */
public abstract class User {
    private String id;
    private String fullName;
    private String email;

    protected User() {
    }

    protected User(String id, String fullName, String email) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
