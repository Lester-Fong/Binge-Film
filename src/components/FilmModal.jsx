import { Modal } from 'flowbite-react';

function FilmModal({ showFilmModal, setShowFilmModal, props, response }) {
    return (
        <Modal show={showFilmModal} onClose={() => setShowFilmModal(false)}>
            <div className="flex justify-end align-bottom mx-2 my-1">
                <button className="close-button absolute -top-px right-0" onClick={() => setShowFilmModal(false)}>
                    X
                </button>
            </div>
            <div className="film-container w-4xl">
                {response ? (
                    <iframe
                        className='w-full h-full overflow-hidden'
                        allow="autoplay; fullscreen"
                        title={props.movie.title}
                        width="100%"
                        height="100%"
                        srcDoc={response}
                        frameBorder="0"
                        allowFullScreen
                    ></iframe>
                ) : (
                    <p>Loading video...</p>
                )}
            </div>

        </Modal>
    );
}

export default FilmModal;