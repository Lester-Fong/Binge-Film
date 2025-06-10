import { Modal } from 'flowbite-react';


function TrailerModal({ showTrailerModal, setShowTrailerModal, props, videoKey }) {
    return (
        <Modal show={showTrailerModal} onClose={() => setShowTrailerModal(false)}>
            <div className="trailer-container w-4xl">
                <div className="bg-gray-900 text-white rounded-t-lg">
                    <h3 className="text-lg text-center font-semibold py-1">{props.movie.title}</h3>
                </div>
                {videoKey ? (
                    <iframe
                        title="Movie Trailer"
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${videoKey}`}
                        frameBorder="0"
                        allowFullScreen
                    ></iframe>
                ) : (
                    <p>Loading video...</p>
                )}
            </div>
            <div className="flex justify-end align-bottom mx-2 my-1">
                <button className="close-button" onClick={() => setShowTrailerModal(false)}>
                    Close
                </button>
            </div>
        </Modal>
    );
}

export default TrailerModal;