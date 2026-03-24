package com.logicauth.tracker.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "assets")
public class Asset {
    @Id
    private String id;
    private String name;
    private String serialNumber;
    private String status; // Available, Assigned, In-Repair, Retired
    private String assignedToEmail; // Email of the user holding the asset
    private String department;
}