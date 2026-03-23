'use client';
import React, { useEffect } from 'react';
import { X, Play } from 'lucide-react';
import './ServiceModal.css';

export default function ServiceModal({ isOpen, onClose, service }) {
    const [selectedVideo, setSelectedVideo] = React.useState(null);
    const [selectedImage, setSelectedImage] = React.useState(null);
    const [selectedPdf, setSelectedPdf] = React.useState(null);
    const [selectedDesign, setSelectedDesign] = React.useState(null);
    const [nestedFolder, setNestedFolder] = React.useState(null);

    const getEmbedUrl = (url) => {
        if (!url) return '';
        let videoId = '';

        // Handle various YouTube formats
        if (url.includes('youtube.com/shorts/')) {
            videoId = url.split('youtube.com/shorts/')[1].split('?')[0];
        } else if (url.includes('youtube.com/watch?v=')) {
            videoId = url.split('v=')[1].split('&')[0];
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        } else if (url.includes('youtube.com/embed/')) {
            return url; // Already correct
        }

        // Optimized params: no cookies, no related videos from others, modest branding, JS API enabled, playsinline for mobile
        return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&enablejsapi=1` : url;
    };

    const getGoogleDriveEmbedUrl = (url) => {
        if (!url) return '';
        // If it's already a preview link, return it
        if (url.includes('/preview')) return url;
        // Convert view link to preview
        return url.replace(/\/view.*/, '/preview');
    };

    const getGoogleDriveId = (url) => {
        if (!url) return null;
        const parts = url.split('/d/');
        if (parts.length < 2) return null;
        return parts[1].split('/')[0];
    };

    const getGoogleDriveThumbnailUrl = (url) => {
        const id = getGoogleDriveId(url);
        return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w800` : null;
    };

    const getFigmaEmbedUrl = (url) => {
        return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`;
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            setSelectedVideo(null);
            setSelectedImage(null);
            setSelectedPdf(null);
            setSelectedDesign(null);
            setNestedFolder(null);
        };
    }, [isOpen]);

    if (!isOpen || !service) return null;

    return (
        <>
            <div className="service-modal-overlay" onClick={onClose}>
                <div className="service-modal-content" onClick={e => e.stopPropagation()}>

                    <header className="service-modal-header">
                        <div className="service-modal-title">
                            {nestedFolder ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <button
                                        onClick={() => setNestedFolder(null)}
                                        style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', fontSize: '1rem' }}
                                    >
                                        <span style={{ fontSize: '1.2rem', marginRight: '5px' }}>←</span> Back
                                    </button>
                                    <span style={{ opacity: 0.5 }}>/</span>
                                    <h2>{nestedFolder.title}</h2>
                                </div>
                            ) : (
                                <>
                                    <h2>{service.title}</h2>
                                    <span>{service.subtitle} Gallery</span>
                                </>
                            )}
                        </div>
                        <button className="close-modal-btn" onClick={onClose}>
                            <X size={24} />
                        </button>
                    </header>

                    <div className="service-modal-body">
                        {nestedFolder ? (
                            // --- RENDER FOLDER CONTENTS ---
                            nestedFolder.videos ? (
                                <div className="video-grid">
                                    {nestedFolder.videos.map((video, index) => (
                                        <div key={index} className="video-card" onClick={() => setSelectedVideo(video)}>
                                            <div className="video-thumbnail">
                                                <img src={video.thumbnail} alt={video.title} />
                                                <div className="play-icon">
                                                    <Play size={20} fill="currentColor" />
                                                </div>
                                            </div>
                                            <div className="video-info">
                                                <h3>{video.title}</h3>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) :
                                <div style={{ textAlign: 'center', padding: '2rem' }}>Empty Folder</div>
                        ) : (
                            // --- RENDER MAIN CONTENTS ---
                            <>
                                {/* Render Folders First */}
                                {service.folders && service.folders.length > 0 && (
                                    <div className="video-grid" style={{ marginBottom: '20px' }}>
                                        {service.folders.map((folder, index) => (
                                            <div key={`folder-${index}`} className="video-card" onClick={() => setNestedFolder(folder)}>
                                                <div className="video-thumbnail" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#333' }}>
                                                    {folder.thumbnail ? (
                                                        <img src={folder.thumbnail} alt={folder.title} style={{ objectFit: 'cover', opacity: 0.6 }} />
                                                    ) : null}
                                                    <div style={{ position: 'absolute', textAlign: 'center', zIndex: 2 }}>
                                                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📁</div>
                                                    </div>
                                                </div>
                                                <div className="video-info">
                                                    <h3>{folder.title}</h3>
                                                    <span style={{ fontSize: '0.8rem', color: '#999' }}>{folder.videos?.length || 0} items</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {service.videos && service.videos.length > 0 ? (
                                    <div className="video-grid">
                                        {service.videos.map((video, index) => (
                                            <div key={index} className="video-card" onClick={() => setSelectedVideo(video)}>
                                                <div className="video-thumbnail">
                                                    <img src={video.thumbnail} alt={video.title} />
                                                    <div className="play-icon">
                                                        <Play size={20} fill="currentColor" />
                                                    </div>
                                                </div>
                                                <div className="video-info">
                                                    <h3>{video.title}</h3>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : service.images && service.images.length > 0 ? (
                                    <div className="video-grid">
                                        {service.images.map((img, index) => (
                                            <div key={index} className="video-card" onClick={() => setSelectedImage(img)}>
                                                <div className="video-thumbnail">
                                                    <img src={img.src} alt={img.title || 'Image'} style={{ objectFit: 'cover' }} />
                                                </div>
                                                {img.title && (
                                                    <div className="video-info">
                                                        <h3>{img.title}</h3>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : service.pdfs && service.pdfs.length > 0 ? (
                                    <div className="video-grid">
                                        {service.pdfs.map((pdf, index) => {
                                            const thumbUrl = pdf.thumbnail || getGoogleDriveThumbnailUrl(pdf.src);
                                            return (
                                                <div key={index} className="video-card" onClick={() => setSelectedPdf(pdf)}>
                                                    <div className="video-thumbnail" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#222', overflow: 'hidden' }}>
                                                        {thumbUrl ? (
                                                            <img
                                                                src={thumbUrl}
                                                                alt={pdf.title}
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    e.target.parentElement.querySelector('.pdf-fallback').style.display = 'block';
                                                                }}
                                                            />
                                                        ) : null}
                                                        <div className="pdf-fallback" style={{ display: thumbUrl ? 'none' : 'block', color: '#fff', textAlign: 'center' }}>
                                                            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📄</div>
                                                            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>PREVIEW</span>
                                                        </div>
                                                    </div>
                                                    <div className="video-info">
                                                        <h3>{pdf.title || `Document ${index + 1}`}</h3>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : service.designs && service.designs.length > 0 ? (
                                    <div className="video-grid">
                                        {service.designs.map((design, index) => (
                                            <div key={index} className="video-card" onClick={() => setSelectedDesign(design)}>
                                                <div className="video-thumbnail" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1e1e1e', borderBottom: '3px solid #F24E1E', overflow: 'hidden', position: 'relative' }}>
                                                    {/* Live Figma Preview or Thumbnail */}
                                                    {design.thumbnail ? (
                                                        <img src={design.thumbnail} alt={design.title} style={{ objectFit: 'cover' }} />
                                                    ) : (
                                                        <iframe
                                                            src={getFigmaEmbedUrl(design.src)}
                                                            title={design.title}
                                                            style={{
                                                                width: '100%',
                                                                height: '150%', // Push footer down
                                                                border: 'none',
                                                                pointerEvents: 'none',
                                                                transform: 'scale(1.6)', // Zoom in to fill
                                                                transformOrigin: 'center top',
                                                                background: '#1e1e1e'
                                                            }}
                                                            loading="lazy"
                                                        />
                                                    )}
                                                    {/* Transparent overlay to ensure card is clickable */}
                                                    <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'transparent' }} />
                                                </div>
                                                <div className="video-info">
                                                    <h3>{design.title || `Design ${index + 1}`}</h3>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : !service.folders ? (
                                    <div style={{ textAlign: 'center', color: '#666', padding: '4rem' }}>
                                        <h3>No content available for this service yet.</h3>
                                    </div>
                                ) : null}
                            </>
                        )}
                    </div>

                </div>
            </div>

            {/* Full Screen Video Player Overlay */}
            {selectedVideo && (
                <div className="video-player-overlay" onClick={() => setSelectedVideo(null)}>
                    <button className="close-video-btn" onClick={() => setSelectedVideo(null)}>
                        <X size={32} />
                    </button>
                    <div className="video-player-container" onClick={e => e.stopPropagation()}>
                        {selectedVideo.type === 'youtube' ? (
                            <iframe
                                className="fullscreen-video"
                                src={getEmbedUrl(selectedVideo.src)}
                                title={selectedVideo.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                                loading="lazy"
                            />
                        ) : (
                            <video
                                src={selectedVideo.src || "https://videos.pexels.com/video-files/856972/856972-hd_1920_1080_25fps.mp4"} // Fallback demo video
                                controls
                                autoPlay
                                className="fullscreen-video"
                            />
                        )}
                        <div className="video-player-title">{selectedVideo.title}</div>
                    </div>
                </div>
            )}

            {/* Full Screen Image Overlay */}
            {selectedImage && (
                <div className="video-player-overlay" onClick={() => setSelectedImage(null)}>
                    <button className="close-video-btn" onClick={() => setSelectedImage(null)}>
                        <X size={32} />
                    </button>
                    <div className="video-player-container" style={{ aspectRatio: 'auto', maxWidth: '90vw', maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
                        <img
                            src={selectedImage.src}
                            alt={selectedImage.title || 'Full View'}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                maxHeight: '80vh',
                                borderRadius: '12px'
                            }}
                        />
                        {selectedImage.title && <div className="video-player-title">{selectedImage.title}</div>}
                    </div>
                </div>
            )}

            {/* Full Screen PDF Overlay */}
            {selectedPdf && (
                <div className="video-player-overlay" onClick={() => setSelectedPdf(null)}>
                    <button className="close-video-btn" onClick={() => setSelectedPdf(null)}>
                        <X size={32} />
                    </button>
                    <div className="video-player-container" style={{ aspectRatio: 'auto', width: '90vw', height: '90vh', maxWidth: '1200px' }} onClick={e => e.stopPropagation()}>
                        <iframe
                            src={getGoogleDriveEmbedUrl(selectedPdf.src)}
                            title={selectedPdf.title}
                            style={{ width: '100%', height: '100%', borderRadius: '12px', border: 'none' }}
                        />
                        {selectedPdf.title && <div className="video-player-title">{selectedPdf.title}</div>}
                    </div>
                </div>
            )}

            {/* Full Screen Figma Overlay */}
            {selectedDesign && (
                <div className="video-player-overlay" onClick={() => setSelectedDesign(null)}>
                    <button className="close-video-btn" onClick={() => setSelectedDesign(null)}>
                        <X size={32} />
                    </button>
                    <div className="video-player-container" style={{ aspectRatio: 'auto', width: '95vw', height: '95vh' }} onClick={e => e.stopPropagation()}>
                        <iframe
                            src={getFigmaEmbedUrl(selectedDesign.src || selectedDesign.url)}
                            title={selectedDesign.title}
                            style={{ width: '100%', height: '100%', borderRadius: '12px', border: 'none', background: '#000' }}
                            allowFullScreen
                        />
                        {selectedDesign.title && <div className="video-player-title">{selectedDesign.title}</div>}
                    </div>
                </div>
            )}
        </>
    );
}
