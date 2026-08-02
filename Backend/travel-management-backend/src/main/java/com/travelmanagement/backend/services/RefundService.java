package com.travelmanagement.backend.services;

import com.travelmanagement.backend.entities.CancellationRefund;
import java.math.BigDecimal;
import java.util.List;

public interface RefundService {
    
    CancellationRefund processRefund(Long bookingId, BigDecimal refundAmount) throws Exception;
    
    List<CancellationRefund> getRefundsByUserId(Long userId);

 // Replace your void stub with this:
    CancellationRefund cancelAndRefund(Long entityId, String bookingType, String canceledBy) throws Exception;
	
}