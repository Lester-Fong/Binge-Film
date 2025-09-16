// TODO!! ACCOMODATE THE EMBED RESPONSE VIDEO
import { useMemo, useEffect } from "react";

function EpisodeModal({ isOpen, onClose, tvShowName, seasonNumber, episodeNumber, embedUrl }) {
    // Extract the actual video URL from the nested iframe
    const videoSrc = useMemo(() => {
        if (!embedUrl) return '';

        try {
            // Look for the iframe src in the HTML content
            const iframeMatch = embedUrl.match(/src="([^"]*cloudnestra\.com[^"]*)"/);
            if (iframeMatch && iframeMatch[1]) {
                let src = iframeMatch[1];
                // If it starts with //, add https:
                if (src.startsWith('//')) {
                    src = 'https:' + src;
                }
                return src;
            } else {
                console.log("No cloudnestra iframe found in response");
                console.log("Response content:", embedUrl.substring(0, 500) + "...");
            }
        } catch (error) {
            console.error("Error extracting video src:", error);
        }

        return '';
    }, [embedUrl]);

    // Fallback: Create a simplified HTML version with fixed URLs
    const fallbackHTML = useMemo(() => {
        if (!embedUrl || videoSrc) return '';

        try {
            // Fix relative URLs in the response
            let fixedHTML = embedUrl
                .replace(/src="\/([^"]*)">/g, 'src="https://vidsrc.stream/$1">') // Fix relative script/resource URLs
                .replace(/href="\/([^"]*)">/g, 'href="https://vidsrc.stream/$1">') // Fix relative link URLs
                .replace(/src="\/\/([^"]*)">/g, 'src="https://$1">'); // Fix protocol-relative URLs

            // Create a simplified HTML that tries to preserve the original structure
            return `
                <!DOCTYPE html>
                <html>
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <style>
                            body { 
                                margin: 0; 
                                padding: 0; 
                                background: black; 
                                overflow: hidden;
                            }
                            #the_frame {
                                width: 100%;
                                height: 100vh;
                            }
                            #player_iframe {
                                width: 100%;
                                height: 100%;
                                border: none;
                            }
                        </style>
                    </head>
                    <body>
                        ${fixedHTML}
                    </body>
                </html>
            `;
        } catch (error) {
            console.error("Error creating fallback HTML:", error);
            return '';
        }
    }, [embedUrl, videoSrc]);

    // Function to open video in new tab as fallback
    const openInNewTab = () => {
        if (videoSrc) {
            window.open(videoSrc, '_blank');
            onClose();
        }
    };

    // Function to handle modal close and stop video
    const handleCloseModal = () => {
        onClose();
        // Force iframe to reload by clearing and resetting the src
        const iframes = document.querySelectorAll('.episode-modal iframe');
        iframes.forEach(iframe => {
            iframe.src = 'about:blank';
        });
    };

    // Stop video when modal is closed
    useEffect(() => {
        if (!isOpen) {
            // When modal is closed, stop any playing videos
            const iframes = document.querySelectorAll('.episode-modal iframe');
            iframes.forEach(iframe => {
                iframe.src = 'about:blank';
            });
        }
    }, [isOpen]);

    // Generate episode title
    const episodeTitle = `${tvShowName} - Season ${seasonNumber}, Episode ${episodeNumber}`;

    return (
        <div className={`episode-modal fixed inset-0 z-150 flex items-center justify-center bg-gray-900 bg-opacity-75 ${isOpen ? 'block' : 'hidden'}`}>
            <button className="bg-yellow-600 absolute -top-px right-0 z-50 rounded-full" onClick={handleCloseModal}>
                X
            </button>
            <div className="episode-modal-content relative w-full h-full max-h-4xl bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="film-container">
                    {embedUrl && videoSrc ? (
                        <iframe
                            key={isOpen ? 'video-playing' : 'video-stopped'}
                            className='w-full h-full overflow-hidden'
                            allow="autoplay; fullscreen"
                            title={episodeTitle}
                            width="100%"
                            height="100%"
                            src={videoSrc}
                            referrerPolicy="no-referrer"
                            onError={(e) => console.log("Iframe error:", e)}
                        ></iframe>
                    ) : embedUrl && fallbackHTML ? (
                        <iframe
                            key={isOpen ? 'fallback-playing' : 'fallback-stopped'}
                            className='w-full h-full overflow-hidden'
                            allow="autoplay; fullscreen"
                            title={episodeTitle}
                            width="100%"
                            height="100%"
                            srcDoc={fallbackHTML}
                            referrerPolicy="no-referrer"
                            onError={(e) => console.log("Fallback iframe error:", e)}
                        ></iframe>
                    ) : (
                        <div className="flex items-center justify-center h-full flex-col">
                            <p className="text-black mb-4">
                                {embedUrl ? 'Unable to load video player in modal' : 'Loading video...'}
                            </p>
                            {videoSrc && (
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={openInNewTab}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Open Video in New Tab
                                    </button>
                                    <button
                                        onClick={() => {
                                            console.log("Video src:", videoSrc);
                                            console.log("Response HTML:", embedUrl.substring(0, 1000));
                                        }}
                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded text-sm"
                                    >
                                        Debug Info (Check Console)
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EpisodeModal;
