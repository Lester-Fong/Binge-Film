import { useMemo } from "react";

function FilmModal({ showFilmModal, setShowFilmModal, props, response }) {

    // // Modify response before passing to iframe
    const modifiedResponse = useMemo(() => {
        if (!response) return '';

        // Your custom CSS to inject
        const customStyles = `
        <style>
            html {
                overflow: hidden;
            }
            body {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                background-color: black;
                color: white;
            }
            #the_frame {
                width: 100%;
                height: 100vh;
                overflow: hidden;
            }
        </style>
    `;

        let cleanResponse = response;

        // Remove all <style>...</style> tags from head or anywhere
        cleanResponse = cleanResponse.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

        // Inject customStyles into the <head> tag
        if (cleanResponse.includes('<head>')) {
            return cleanResponse.replace('<head>', `<head>${customStyles}`);
        } else if (cleanResponse.includes('<html')) {
            // In case there's no <head> tag but <html> exists
            return cleanResponse.replace('<html>', `<html><head>${customStyles}</head>`);
        } else {
            // Fallback: wrap whole response
            return `
            <!DOCTYPE html>
            <html>
                <head>
                    ${customStyles}
                </head>
                <body>
                    ${cleanResponse}
                </body>
            </html>
        `;
        }
    }, [response]);

    return (
        <div className={`film-modal fixed inset-0 z-150 flex items-center justify-center bg-gray-900 bg-opacity-75 ${showFilmModal ? 'block' : 'hidden'}`}>
            <button className="bg-yellow-600 absolute -top-px right-0 z-50 rounded-full" onClick={() => setShowFilmModal(false)}>
                X
            </button>
            <div className="film-modal-content relative w-full h-full max-h-4xl bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="film-container w-4xl">
                    {response ? (
                        <iframe
                            className='w-full h-full overflow-hidden'
                            allow="autoplay; fullscreen"
                            title={props.movie.title}
                            width="100%"
                            height="100%"
                            srcDoc={modifiedResponse}
                        ></iframe>
                    ) : (
                        <p>Loading video...</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FilmModal;
