import { useMemo, useEffect } from "react";

function EpisodeModal({ isOpen, onClose, tvShowName, seasonNumber, episodeNumber, embedUrl }) {
    console.log("EpisodeModal received embedUrl:", embedUrl);

    // Extract the actual video URL from the nested iframe if needed
    const videoSrc = useMemo(() => {
        if (!embedUrl) return '';

        try {
            // If the embedUrl is already a direct video source, use it
            if (typeof embedUrl === 'string') {
                return embedUrl;
            }

            // If it's an HTML response, try to extract the iframe
            if (typeof embedUrl === 'object' || embedUrl.includes('<iframe')) {
                const iframeMatch = embedUrl.match(/src="([^"]*cloudnestra\.com[^"]*)"/);
                if (iframeMatch && iframeMatch[1]) {
                    let src = iframeMatch[1];
                    // If it starts with //, add https:
                    if (src.startsWith('//')) {
                        src = 'https:' + src;
                    }
                    console.log("Extracted video src:", src);
                    return src;
                } else {
                    console.log("No cloudnestra iframe found in response");
                }
            }
        } catch (error) {
            console.error("Error extracting video src:", error);
        }

        return embedUrl || '';
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

    // Generate title with season and episode numbers
    const episodeTitle = `${tvShowName} - Season ${seasonNumber}, Episode ${episodeNumber}`;

    return (
        <div className={`episode-modal fixed inset-0 z-150 flex items-center justify-center bg-gray-900 bg-opacity-75 ${isOpen ? 'block' : 'hidden'}`}>
            <button className="absolute top-4 right-4 z-50 bg-red-600 hover:bg-red-700 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold" onClick={handleCloseModal}>
                X
            </button>
            <div className="episode-modal-content relative w-full h-full max-w-6xl max-h-4xl bg-black rounded-lg shadow-lg overflow-hidden mx-4">
                <div className="episode-title bg-gray-900 text-white py-3 px-4 text-center font-semibold">
                    {episodeTitle}
                </div>
                <div className="episode-container w-full h-full">
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
                            onLoad={() => console.log("Iframe loaded successfully")}
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
                            allowFullScreen
                            onError={(e) => console.log("Fallback iframe error:", e)}
                            onLoad={() => console.log("Fallback iframe loaded")}
                        ></iframe>
                    ) : (
                        <div className="flex items-center justify-center h-full flex-col bg-gray-800 text-white p-6">
                            <p className="text-xl mb-4">
                                {embedUrl ? 'Unable to load video player in modal' : 'Loading video player...'}
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
                                            console.log("Response URL:", embedUrl);
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
