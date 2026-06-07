import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiHeart } from 'react-icons/fi';
import './Reviews.css';

const Reviews = () => {
  const initialReviews = [
    {
      id: 1,
      name: "Lisa Chen",
      trip: "Japan Cultural Experience",
      time: "1 week ago",
      rating: 5,
      comment: '"From cherry blossoms in Kyoto to the bustling streets of Tokyo, every moment was perfectly curated. The tea ceremony experience was unforgettable. Highly recommended!"',
      likes: 18,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Marcus O'Brien",
      trip: "Iceland Northern Lights",
      time: "2 weeks ago",
      rating: 5,
      comment: '"The Northern Lights tour was absolutely spectacular! Our guide\'s knowledge of the best viewing spots made all the difference. The hot springs visit was the perfect end to each day."',
      likes: 42,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Rachel Thompson",
      trip: "Peru Machu Picchu Trek",
      time: "3 weeks ago",
      rating: 5,
      comment: '"Challenging but incredibly rewarding! The support team was amazing and the views were breathtaking. Reaching Machu Picchu at sunrise was a life-changing moment."',
      likes: 27,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop"
    }
  ];

  const [reviews, setReviews] = useState(initialReviews);

  const handleLike = (id) => {
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === id ? { ...review, likes: review.likes + 1 } : review
      )
    );
  };

  return (
    <div className="te-reviews-container">
      
      {/* Upper Dark Header: Deep Slate Blue (#1F2937) */}
      <header className="te-reviews-hero">
        <div className="te-reviews-badge">
          <span className="badge-dot"></span> Testimonials
        </div>
        <h1 className="te-reviews-title">
          What Our <span className="te-mint-text">Travelers</span> Say About Their Adventures
        </h1>
        <p className="te-reviews-subtitle">
          Read authentic stories from explorers who have journeyed with TravelEase.
        </p>
      </header>

      {/* Lower Light Body: Pure White (#FFFFFF) */}
      <main className="te-reviews-content-section">
        
        {/* Carousel Wrapper holding the cards */}
        <div className="te-carousel-wrapper">
          
          <button className="te-carousel-arrow arrow-left" aria-label="Previous review">
            <FiChevronLeft />
          </button>

          <div className="te-reviews-grid">
            {reviews.map((review) => (
              <article key={review.id} className="te-review-card">
                
                {/* Profile Header Block */}
                <div className="te-card-meta-row">
                  <div className="te-profile-box">
                    <img src={review.avatar} alt={review.name} className="te-avatar" />
                    <div className="te-user-details">
                      <h3>{review.name}</h3>
                      <p>{review.trip}</p>
                    </div>
                  </div>
                  <span className="te-time-stamp">{review.time}</span>
                </div>

                {/* Rating Component Row using Mint Green for Highlights */}
                <div className="te-stars-row">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <span key={i} className="te-star">★</span>
                  ))}
                </div>

                {/* Main Testimonial Block Quote */}
                <p className="te-review-text">{review.comment}</p>

                {/* Action Interaction Row */}
                <div className="te-card-actions">
                  <button className="te-like-btn" onClick={() => handleLike(review.id)}>
                    <FiHeart className="te-heart-icon" />
                    <span className="te-like-count">{review.likes}</span>
                  </button>
                </div>

              </article>
            ))}
          </div>

          <button className="te-carousel-arrow arrow-right" aria-label="Next review">
            <FiChevronRight />
          </button>

        </div>
      </main>
    </div>
  );
};

export default Reviews;