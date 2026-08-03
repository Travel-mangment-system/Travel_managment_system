package com.travelmanagement.backend.repositories.Booking;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.travelmanagement.backend.entities.Booking;
import com.travelmanagement.backend.entities.BookingStatus;
import com.travelmanagement.backend.entities.User;

public interface BookingRepository extends JpaRepository<Booking, Long>{
	List<Booking> findByUserId(Long userId);

	List<Booking> findAllByUserId(Long userId);

	List<Booking> findBySchedule_ScheduleIdAndBookingStatus(Long scheduleId, BookingStatus status);
	
	@Query(value = "SELECT * FROM bookings ORDER BY id DESC LIMIT 1", nativeQuery = true)
    Optional<Booking> findLatestBooking();


	@Query("SELECT b FROM Booking b WHERE b.schedule.scheduleId = :scheduleId")
    List<Booking> findBySchedule_ScheduleId(@Param("scheduleId") Long scheduleId);

    // If you have a query to fetch booked seat IDs, update it to use schedule.scheduleId too:
    @Query("SELECT bs.seat.id FROM BookedSeat bs WHERE bs.booking.schedule.scheduleId = :scheduleId")
    List<Long> findBookedSeatIdsByScheduleId(@Param("scheduleId") Long scheduleId);
    
    @Query("SELECT COUNT(bs) FROM Booking b JOIN b.bookedSeats bs WHERE b.schedule.bus.busProvider.id = :providerId AND DATE(b.schedule.departureDatetime) = :today AND b.bookingStatus = 'CONFIRMED'")
    long countSeatsBookedToday(@Param("providerId") Long providerId, @Param("today") LocalDate today);

 // Correct! Returns List<Booking>
    List<Booking> findAllByUserIdOrderByIdDesc(Long userId);
}
