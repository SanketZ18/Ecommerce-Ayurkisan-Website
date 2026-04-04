package com.ayurkisan.dto;

public class UserStatsDTO {
    private String id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private long orderCount;

    public UserStatsDTO() {}

    public UserStatsDTO(String id, String name, String email, String phone, String role, long orderCount) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.orderCount = orderCount;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public long getOrderCount() { return orderCount; }
    public void setOrderCount(long orderCount) { this.orderCount = orderCount; }
}
