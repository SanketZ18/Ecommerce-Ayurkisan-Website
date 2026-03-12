package com.ayurkisan.Modules.Returns;

import java.time.LocalDateTime;

public class ReturnUpdate {

    private String status;
    private String remarks;
    private LocalDateTime timestamp = LocalDateTime.now();

    public ReturnUpdate() {}

    public ReturnUpdate(String status, String remarks) {
        this.status = status;
        this.remarks = remarks;
        this.timestamp = LocalDateTime.now();
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
