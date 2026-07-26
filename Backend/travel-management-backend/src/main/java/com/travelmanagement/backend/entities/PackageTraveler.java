package com.travelmanagement.backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "package_travelers")
public class PackageTraveler {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "traveler_id")
    private Long id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "age", nullable = false)
    private int age;

    @Column(name = "gender")
    private Gender gender;

    // This links back to the mappedBy = "packageBooking" in your PackageBooking class
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_booking_id", nullable = false)
    private PackageBooking packageBooking;
}