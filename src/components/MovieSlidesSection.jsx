import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Link } from "react-router-dom"
import MovieCard from "./MovieCard"
import Autoplay from "embla-carousel-autoplay"

function MovieSlidesSection({ movies, section_title = "Popular Movies" }) {
    return (
        <div className="px-5">
            <div className="text-4xl font-bold my-4 ml-2 px-5">
                <p>{section_title}</p>
            </div>
            <Carousel opts={{
                align: "start",
                loop: true,
            }} plugins={[
                Autoplay({
                    delay: 1700000,
                }),
            ]} className="mx-5 mb-5">
                <div className="ml-2">
                    <CarouselContent className="-ml-2">
                        {movies.map((item, index) => (
                            <CarouselItem key={index} className="md:basis-1/4 lg:basis-2/12 flex">
                                <div>
                                    <Card className="movie-card">
                                        <CardContent className="flex aspect-square items-center justify-center p-6">
                                            <Link to={`/movie/${item.id}`} key={item.id} className="movie-link w-100">
                                                <MovieCard key={item.id} movie={item} />
                                            </Link>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </div>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}

export { MovieSlidesSection }