package com.travelmanagement.backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "seat_locks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatLock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lock_id")
    private Long id;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    // Seat "1" <-- "*" SeatLock : locks
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_id")
    private Seat seat;

    // BusSchedule "1" <-- "*" SeatLock : during
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id")
    private BusSchedule schedule;

    // User "1" <-- "*" SeatLock : lockedBy
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(name = "lock_reference")
    private String lockReference;
}