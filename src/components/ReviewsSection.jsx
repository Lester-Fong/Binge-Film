import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { handleDate, truncateText } from "../services/helper";
import "../css/ReviewsSection.css";

function ReviewsSection({ reviews }) {
    const renderRating = (rating) => {
        if (!rating) return null;
        return (
            <div className="review-rating">
                ⭐ {rating}/10
            </div>
        );
    };

    // Sort reviews by rating (highest to lowest)
    const sortedReviews = [...reviews].sort((a, b) => {
        const ratingA = a.author_details?.rating || 0;
        const ratingB = b.author_details?.rating || 0;
        return ratingB - ratingA; // Descending order (highest first)
    });

    // Determine if we should center the cards (for 1-2 reviews)
    const shouldCenter = sortedReviews.length <= 2;
    const shouldShowArrows = sortedReviews.length > 3; // Only show arrows if more than 3 reviews

    // If few reviews, render without carousel for better centering
    if (shouldCenter) {
        return (
            <div className="reviews-section px-5">
                <div className="text-4xl font-bold mt-4 mb-2 ml-2">
                    <p>Movie Reviews</p>
                </div>

                <div className="mx-5 mb-2">
                    <div>
                        <div className="reviews-simple-grid">
                            {sortedReviews.map((review) => (
                                <div key={review.id} className="review-simple-item">
                                    <Card className="review-card">
                                        <CardHeader className="review-header">
                                            <div className="review-author-section">
                                                <CardTitle className="review-author">
                                                    {review.author}
                                                </CardTitle>
                                                {renderRating(review.author_details.rating)}
                                            </div>
                                            <p className="review-date">
                                                {handleDate(review.created_at)}
                                            </p>
                                        </CardHeader>
                                        <CardContent className="review-content">
                                            <p className="review-text">
                                                {truncateText(review.content, 180)}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="reviews-section px-5">
            <div className="text-4xl font-bold mt-4 mb-2 ml-2">
                <p>User Reviews</p>
            </div>

            <Carousel
                opts={{
                    align: "start",
                    loop: false,
                }}
                className="mx-5 mb-2"
            >
                <div className="ml-2">
                    <CarouselContent className="-ml-2">
                        {sortedReviews.map((review) => (
                            <CarouselItem
                                key={review.id}
                                className="review-item"
                            >
                                <div className="review-card-wrapper">
                                    <Card className="review-card">
                                        <CardHeader className="review-header">
                                            <div className="review-author-section">
                                                <CardTitle className="review-author">
                                                    {review.author}
                                                </CardTitle>
                                                {renderRating(review.author_details.rating)}
                                            </div>
                                            <p className="review-date">
                                                {handleDate(review.created_at)}
                                            </p>
                                        </CardHeader>
                                        <CardContent className="review-content">
                                            <p className="review-text">
                                                {truncateText(review.content, 180)}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </div>
                {shouldShowArrows && (
                    <>
                        <CarouselPrevious className="carousel-nav carousel-prev" />
                        <CarouselNext className="carousel-nav carousel-next" />
                    </>
                )}
            </Carousel>
        </div>
    );
}

export default ReviewsSection;
