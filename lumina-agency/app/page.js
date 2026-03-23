'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import SplineScene from '@/components/SplineScene'; // <-- New Spline Component
import Reveal from '@/components/RevealWrapper';
import FAQ from '@/components/FAQ';
import ProcessTimeline from '@/components/ProcessTimeline';
import SoftwareStack from '@/components/SoftwareStack';
import BentoGallery from '@/components/BentoGallery';

// ... (existing imports)

// Inside the component return:
{/* --- SELECTED WORKS (BENTO GALLERY) --- */ }
<section id="work" style={{ padding: '8rem 0', minHeight: '100vh' }}>
  <div className="container">
    <Reveal>
      <h2 className="section-title">GALLERY</h2>
    </Reveal>
  </div>

  {/* Bento Grid Container */}
  <div style={{ padding: '0 2rem', marginTop: '2rem' }}>
    <BentoGallery />
  </div>
</section>
import SpotlightCard from '@/components/SpotlightCard'; // <-- New React Bits Component
import SplashCursor from '@/components/SplashCursor'; //
import LogoLoop from "@/components/LogoLoop";
import Aurora from "@/components/Aurora";
import LightRays from '@/components/LightRays';
import TrueFocus from '@/components/TrueFocus';
import ChromaGrid from '@/components/ChromaGrid';
import ServiceModal from '@/components/ServiceModal';
import StarBorder from '@/components/StarBorder';

export default function Home() {
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleServiceClick = (service) => {
    setSelectedService(service);
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    const subject = `New Project Inquiry from ${formData.name}`;
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;
    window.location.href = `mailto:transcendframes@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <main>
      <SplashCursor />
      <LightRays
        raysOrigin="top-center"
        raysColor="#c9eded"
        raysSpeed={1.5}
        lightSpread={0.8}
        rayLength={1.2}
        followMouse={true}
        mouseInfluence={0.1}
        noiseAmount={0.1}
        distortion={0.05}
        className="custom-rays"
      />

      <ServiceModal
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        service={selectedService}
      />

      {/* ... Rest of your sections (Hero, Services, etc) ... */}
      <Navbar />

      {/* --- HERO SECTION WITH SPLINE 3D --- */}
      <section className="hero" id="home" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        {/* Replaced HeroCanvas with SplineScene */}
        <SplineScene />

        <div className="hero-content" style={{ width: '100%', maxWidth: '1400px', zIndex: 10 }}>
          <Reveal>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              padding: '72px 20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.85rem', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase' }}>
                Creative Technology Studio
              </div>

              {/* replaced plain H1 with TrueFocus */}
              <TrueFocus
                sentence="TRANSCEND FRAMES"
                separator=" "
                manualMode={false}
                blurAmount={5}
                borderColor="#da5fffff"
                glowColor="rgba(255, 95, 162, 0.6)"
                animationDuration={0.8}
                pauseBetweenAnimations={1.5}
              />

              <h2 style={{
                margin: 0,
                fontSize: 'clamp(18px, 3.2vw, 32px)',
                color: 'rgba(255, 255, 255, 1)',
                fontWeight: 600,
                fontFamily: 'var(--font-outfit)'
              }}>
                Defy the Ordinary.
              </h2>

              <p style={{ maxWidth: 900, color: '#9CA3AF', margin: '0 auto', textAlign: 'center', fontSize: '14px' }}>
                Strategy, design, and technology in perfect sync crafting bold digital experiences that scale.
              </p>

              <div className="hero-btn-group" style={{ marginTop: '10px', display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <StarBorder as="button" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} color="#FF0080" speed="4s">
                  Explore Services
                </StarBorder>
                <StarBorder as="button" onClick={() => document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' })} color="#00DFD8" speed="5s">
                  View Process
                </StarBorder>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <LogoLoop
        direction="right"
        speed={60}
        style={{ backgroundColor: '#000' }}
        logos={[
          { src: "/Streax.png", alt: "Streax" },
          { src: "/Glassmate.png", alt: "Glassmate" },
          { src: "/Grofo.png", alt: "Grofo" },
          { src: "/Hatimi Retreats.png", alt: "Hatimi Retreats" },
          { src: "Stratezic.png", alt: "Stratezic" },
        ]}
      />

      <div className="fade-transition" />

      {/* --- CHROMA GRID SHOWCASE --- */}
      <section style={{ padding: '4rem 0' }} id="services">
        <div className="container">
          <Reveal><h2 className="section-title"> SERVICES </h2></Reveal>
        </div>
        <ChromaGrid
          columns={4}
          rows={3}
          onItemClick={handleServiceClick}
          items={[
            {
              image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
              title: '3D Designs',
              subtitle: 'Immersive Modeling',
              handle: 'Blender / C4D / Unreal',
              borderColor: '#FF0080',
              gradient: 'linear-gradient(145deg, #FF0080, #000)',
              url: '#',
              videos: [
                {
                  src: 'https://youtube.com/shorts/wwvsugt2rpM',
                  thumbnail: 'https://img.youtube.com/vi/wwvsugt2rpM/hqdefault.jpg',
                  title: '3D Design Showcase 1',
                  type: 'youtube'
                },
                {
                  src: 'https://youtu.be/2j_OgRH5NyY',
                  thumbnail: 'https://img.youtube.com/vi/2j_OgRH5NyY/hqdefault.jpg',
                  title: '3D Design Showcase 2',
                  type: 'youtube'
                },
                {
                  src: 'https://youtu.be/tdLM9rCL4OU',
                  thumbnail: 'https://img.youtube.com/vi/tdLM9rCL4OU/hqdefault.jpg',
                  title: '3D Design Showcase 3',
                  type: 'youtube'
                },
                {
                  src: 'https://youtu.be/dJyte1AUjfA',
                  thumbnail: 'https://img.youtube.com/vi/dJyte1AUjfA/hqdefault.jpg',
                  title: '3D Design Showcase 4',
                  type: 'youtube'
                },
                {
                  src: 'https://youtu.be/BTbfZ_3A_QU',
                  thumbnail: 'https://img.youtube.com/vi/BTbfZ_3A_QU/hqdefault.jpg',
                  title: '3D Design Showcase 5',
                  type: 'youtube'
                }
              ]
            },
            {
              image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
              title: 'AI Video Ads',
              subtitle: 'Generative Marketing',
              handle: 'Midjourney / Runway / AI',
              borderColor: '#4F46E5',
              gradient: 'linear-gradient(210deg, #4F46E5, #000)',
              url: '#',
              videos: [
                {
                  src: 'https://www.youtube.com/shorts/zx2vq8AgLww',
                  thumbnail: 'https://img.youtube.com/vi/zx2vq8AgLww/hqdefault.jpg',
                  title: 'Sour Bomb Giveaway',
                  type: 'youtube'
                },
                {
                  src: 'https://www.youtube.com/shorts/Tu2x8MAKe8s',
                  thumbnail: 'https://img.youtube.com/vi/Tu2x8MAKe8s/hqdefault.jpg',
                  title: 'Sour Bomb Ad',
                  type: 'youtube'
                },
                {
                  src: 'https://www.youtube.com/shorts/XfJf7pYv_WE',
                  thumbnail: 'https://img.youtube.com/vi/XfJf7pYv_WE/hqdefault.jpg',
                  title: 'Piconut Ad',
                  type: 'youtube'
                },
                {
                  src: 'https://www.youtube.com/shorts/8yYznVCtx8c',
                  thumbnail: 'https://img.youtube.com/vi/8yYznVCtx8c/hqdefault.jpg',
                  title: 'Kachi Kerry Giveaway ad',
                  type: 'youtube'
                },
                {
                  src: 'https://www.youtube.com/shorts/0lCVkznjQcY',
                  thumbnail: 'https://img.youtube.com/vi/0lCVkznjQcY/hqdefault.jpg',
                  title: 'Kachi Kerry ad',
                  type: 'youtube'
                },
                {
                  src: 'https://www.youtube.com/shorts/eAqLyFXtDZ8',
                  thumbnail: 'https://img.youtube.com/vi/eAqLyFXtDZ8/hqdefault.jpg',
                  title: 'Kachi Kerry 2',
                  type: 'youtube'
                },
                {
                  src: 'https://www.youtube.com/shorts/ymgHbV2sLaI',
                  thumbnail: 'https://img.youtube.com/vi/ymgHbV2sLaI/hqdefault.jpg',
                  title: 'Halloween Festive Ad',
                  type: 'youtube'
                },
                {
                  src: 'https://www.youtube.com/shorts/e48Nq6uc2vg',
                  thumbnail: 'https://img.youtube.com/vi/e48Nq6uc2vg/hqdefault.jpg',
                  title: 'Dobiee AD my toy and joy',
                  type: 'youtube'
                },
                {
                  src: 'https://www.youtube.com/shorts/LF_j3u0HY2w',
                  thumbnail: 'https://img.youtube.com/vi/LF_j3u0HY2w/hqdefault.jpg',
                  title: 'Bhoot Cafe Ad',
                  type: 'youtube'
                }
              ]
            },
            {
              image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
              title: 'Animations',
              subtitle: 'Motion Graphics',
              handle: 'After Effects / Rive',
              borderColor: '#10B981',
              gradient: 'linear-gradient(165deg, #10B981, #000)',
              url: '#',
              videos: [
                // Using hqdefault.jpg for standard quality thumbs since maxres isn't always available
                { title: "Animation Showcase 1", duration: "0:30", thumbnail: "https://img.youtube.com/vi/XG-Yjn-j_D0/hqdefault.jpg", src: "https://www.youtube.com/embed/XG-Yjn-j_D0?autoplay=1", type: "youtube" },
                { title: "Animation Showcase 2", duration: "0:45", thumbnail: "https://img.youtube.com/vi/vGZmajSQlHc/hqdefault.jpg", src: "https://www.youtube.com/embed/vGZmajSQlHc?autoplay=1", type: "youtube" },
                { title: "Animation Showcase 3", duration: "1:00", thumbnail: "https://img.youtube.com/vi/USV74JsJZTE/hqdefault.jpg", src: "https://www.youtube.com/embed/USV74JsJZTE?autoplay=1", type: "youtube" }
              ]
            },
            {
              image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
              title: 'Digital Campaigns',
              subtitle: 'Social Strategy',
              handle: 'Meta / Ads / Growth',
              borderColor: '#F59E0B',
              gradient: 'linear-gradient(195deg, #F59E0B, #000)',
              url: '#',
              folders: [
                {
                  title: 'BJP',
                  thumbnail: 'https://img.youtube.com/vi/8_WdNsRLG7g/hqdefault.jpg',
                  videos: [
                    { title: 'Video 1', src: 'https://youtu.be/8_WdNsRLG7g', thumbnail: 'https://img.youtube.com/vi/8_WdNsRLG7g/hqdefault.jpg', type: 'youtube' },
                    { title: 'Video 2', src: 'https://youtube.com/shorts/FB8fgi-anwE', thumbnail: 'https://img.youtube.com/vi/FB8fgi-anwE/hqdefault.jpg', type: 'youtube' },
                    { title: 'Video 3', src: 'https://youtube.com/shorts/FfRVy0Y3brw', thumbnail: 'https://img.youtube.com/vi/FfRVy0Y3brw/hqdefault.jpg', type: 'youtube' },
                    { title: 'Video 4', src: 'https://youtube.com/shorts/oAcnxQ6Heo8', thumbnail: 'https://img.youtube.com/vi/oAcnxQ6Heo8/hqdefault.jpg', type: 'youtube' },
                    { title: 'Video 5', src: 'https://youtube.com/shorts/KDuPKyPoUBg', thumbnail: 'https://img.youtube.com/vi/KDuPKyPoUBg/hqdefault.jpg', type: 'youtube' },
                    { title: 'Video 6', src: 'https://youtube.com/shorts/Bz8ru3cQJNY', thumbnail: 'https://img.youtube.com/vi/Bz8ru3cQJNY/hqdefault.jpg', type: 'youtube' },
                    { title: 'Video 7', src: 'https://youtube.com/shorts/YsOPQkOONlE', thumbnail: 'https://img.youtube.com/vi/YsOPQkOONlE/hqdefault.jpg', type: 'youtube' }
                  ]
                }
              ]
            },
            {
              image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80',
              title: 'UI/UX Design',
              subtitle: 'Figma Prototypes',
              handle: 'Figma / Web / Mobile',
              borderColor: '#8B5CF6',
              gradient: 'linear-gradient(225deg, #8B5CF6, #000)',
              url: '#',
              designs: [
                { title: 'Adidas', src: 'https://www.figma.com/design/sVScETWlt17ZiyXkcV0JNm/Adidas-Site?node-id=0-1&t=3BIsHeEmBMKyrE7u-1' },
                { title: 'ROG and Community Page', src: 'https://www.figma.com/design/VX39Uk8foyrhLyFuHEQQkj/Project-2?node-id=0-1&t=xRcMVSF1BXza6k1z-1' },
                { title: 'Website Landing Page', src: 'https://www.figma.com/proto/IAFSq7OmpPqO8ncaJvPzd1/Website-Landing-Page?node-id=3-2&t=dhGmmRBcAKpTR39q-1' }
              ]
            },
            {
              image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
              title: 'Logo Animations',
              subtitle: 'Brand Motion',
              handle: 'Identity / Reveal',
              borderColor: '#EF4444',
              gradient: 'linear-gradient(255deg, #EF4444, #000)',
              url: '#',
              videos: [
                { title: 'Logo Animation Showcase', src: 'https://youtu.be/V_-0SKy9Xcw', thumbnail: 'https://img.youtube.com/vi/V_-0SKy9Xcw/hqdefault.jpg', type: 'youtube' },
                { title: 'Logo Animation 1', src: 'https://youtu.be/cU4hbs02sZA', thumbnail: 'https://img.youtube.com/vi/cU4hbs02sZA/hqdefault.jpg', type: 'youtube' },
                { title: 'Logo Animation 2', src: 'https://youtu.be/xKwmE6_RFPA', thumbnail: 'https://img.youtube.com/vi/xKwmE6_RFPA/hqdefault.jpg', type: 'youtube' },
                { title: 'Logo Animation 3', src: 'https://youtu.be/goJ3IM1JMnE', thumbnail: 'https://img.youtube.com/vi/goJ3IM1JMnE/hqdefault.jpg', type: 'youtube' },
                { title: 'Logo Animation 4', src: 'https://youtu.be/iVw6gCqjeY4', thumbnail: 'https://img.youtube.com/vi/iVw6gCqjeY4/hqdefault.jpg', type: 'youtube' },
                { title: 'Logo Animation 5', src: 'https://youtu.be/EZtVIBG28B8', thumbnail: 'https://img.youtube.com/vi/EZtVIBG28B8/hqdefault.jpg', type: 'youtube' },
                { title: 'Logo Animation 6', src: 'https://youtu.be/dTQxdWyHY4s', thumbnail: 'https://img.youtube.com/vi/dTQxdWyHY4s/hqdefault.jpg', type: 'youtube' }
              ]
            },
            {
              image: '/Gemini_Generated_Image_k8izt2k8izt2k8iz.png',
              title: 'Podcast Editing',
              subtitle: 'Long-Form Content',
              handle: 'Engagement / Viral',
              borderColor: '#06B6D4',
              gradient: 'linear-gradient(185deg, #06B6D4, #000)',
              url: '#',
              videos: [
                { title: "Podcast Edit Showcase 1", thumbnail: "https://img.youtube.com/vi/5P4mI2Bn5yg/hqdefault.jpg", src: "https://www.youtube.com/embed/5P4mI2Bn5yg?autoplay=1", type: "youtube" }
              ]
            },
            {
              image: '/Posters.png',
              title: 'Brochures & Posters',
              subtitle: 'Print Media',
              handle: 'Layout / Typography',
              borderColor: '#84CC16',
              gradient: 'linear-gradient(135deg, #84CC16, #000)',
              url: '#',
              pdfs: [
                { title: 'Design Portfolio 1', src: 'https://drive.google.com/file/d/1SSNqOcd4C9oezSYfZiwqCZ2TN6ST64gF/view?usp=drive_link' },
                { title: 'Design Portfolio 2', src: 'https://drive.google.com/file/d/12IxMfrUs_sfpL59NkPveHWie6NFyLPgM/view?usp=drive_link' },
                { title: 'Design Portfolio 3', src: 'https://drive.google.com/file/d/15qQmh6mU8lNIGRxBCr7e1Nej-3ccvKcQ/view?usp=drive_link' },
                { title: 'Design Portfolio 4', src: 'https://drive.google.com/file/d/1iUxerMpagCG8BmUBDltDp85sViBcDRhp/view?usp=drive_link' }
              ]
            },
            {
              image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
              title: 'Thumbnails',
              subtitle: 'High CTR Design',
              handle: 'YouTube / Social',
              borderColor: '#F43F5E',
              gradient: 'linear-gradient(125deg, #F43F5E, #000)',
              url: '#'
            },
            {
              image: '/ProductVisuals.png',
              title: 'Product Visuals',
              subtitle: 'E-Commerce',
              handle: 'Showcase / Rendering',
              borderColor: '#3B82F6',
              gradient: 'linear-gradient(225deg, #3B82F6, #000)',
              url: '#'
            },
            {
              image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
              title: 'Video Projects',
              subtitle: 'Long-form Video Editing',
              handle: 'Production / Grading',
              borderColor: '#D946EF',
              gradient: 'linear-gradient(165deg, #D946EF, #000)',
              url: '#',
              folders: [
                {
                  title: 'Streax India',
                  thumbnail: 'https://img.youtube.com/vi/8EsWJK4pGOc/hqdefault.jpg',
                  videos: [
                    { title: 'How to Talk Effectively', src: 'https://youtu.be/8EsWJK4pGOc', thumbnail: 'https://img.youtube.com/vi/8EsWJK4pGOc/hqdefault.jpg', type: 'youtube' },
                    { title: 'Winning Client’s Trust', src: 'https://youtu.be/Viai7gC0wrM', thumbnail: 'https://img.youtube.com/vi/Viai7gC0wrM/hqdefault.jpg', type: 'youtube' },
                    { title: 'Verbal and Non Verbal Communication', src: 'https://youtu.be/kCRtBxGY3FA', thumbnail: 'https://img.youtube.com/vi/kCRtBxGY3FA/hqdefault.jpg', type: 'youtube' },
                    { title: 'Phone Manners', src: 'https://youtu.be/uk9yMc-XSBc', thumbnail: 'https://img.youtube.com/vi/uk9yMc-XSBc/hqdefault.jpg', type: 'youtube' },
                    { title: 'How to do Cleansing', src: 'https://youtu.be/uQxxXGi1MKM', thumbnail: 'https://img.youtube.com/vi/uQxxXGi1MKM/hqdefault.jpg', type: 'youtube' },
                    { title: 'How to do Bleach', src: 'https://youtu.be/ZsMsiT9CtuU', thumbnail: 'https://img.youtube.com/vi/ZsMsiT9CtuU/hqdefault.jpg', type: 'youtube' },
                    { title: 'How to do Detan', src: 'https://youtu.be/3O2B1uTECsc', thumbnail: 'https://img.youtube.com/vi/3O2B1uTECsc/hqdefault.jpg', type: 'youtube' },
                    { title: 'How to do Scrub', src: 'https://youtu.be/FcMSvwzBOBU', thumbnail: 'https://img.youtube.com/vi/FcMSvwzBOBU/hqdefault.jpg', type: 'youtube' },
                    { title: 'How to Give Steam', src: 'https://youtu.be/6ffrewCNbqc', thumbnail: 'https://img.youtube.com/vi/6ffrewCNbqc/hqdefault.jpg', type: 'youtube' },
                    { title: 'How to Remove Blackheads', src: 'https://youtu.be/EyHsO7_Mcco', thumbnail: 'https://img.youtube.com/vi/EyHsO7_Mcco/hqdefault.jpg', type: 'youtube' },
                    { title: 'How to do Face Massage', src: 'https://youtu.be/CzTaFHRBAk4', thumbnail: 'https://img.youtube.com/vi/CzTaFHRBAk4/hqdefault.jpg', type: 'youtube' },
                    { title: 'How to Apply Face Mask', src: 'https://youtu.be/A-pbYD3fqWs', thumbnail: 'https://img.youtube.com/vi/A-pbYD3fqWs/hqdefault.jpg', type: 'youtube' }
                  ]
                },
                {
                  title: 'Expertrons',
                  thumbnail: 'https://img.youtube.com/vi/8Y4JyDEfsOQ/hqdefault.jpg',
                  videos: [
                    { title: 'Expertrons', src: 'https://youtu.be/8Y4JyDEfsOQ', thumbnail: 'https://img.youtube.com/vi/8Y4JyDEfsOQ/hqdefault.jpg', type: 'youtube' }
                  ]
                }
              ]
            },
            {
              image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
              title: 'Virtual DJ',
              subtitle: 'Audio Visuals',
              handle: 'Sound / Mixing',
              borderColor: '#22C55E',
              gradient: 'linear-gradient(145deg, #22C55E, #000)',
              url: '#',
              videos: [
                { title: 'Virtual DJ Setup', src: 'https://youtu.be/i7HhDd_yvVk', thumbnail: 'https://img.youtube.com/vi/i7HhDd_yvVk/hqdefault.jpg', type: 'youtube' }
              ]
            }
          ]}
        />
      </section>

      {/* --- PROCESS TIMELINE --- */}
      <section id="process">
        <ProcessTimeline />
        <SoftwareStack />
      </section>

      {/* --- SELECTED WORKS (BENTO GALLERY) --- */}
      <section id="work" style={{ padding: '8rem 0', minHeight: '100vh' }}>
        <div className="container">
          <Reveal>
            <h2 className="section-title">GALLERY</h2>
          </Reveal>
        </div>

        {/* Bento Grid Container */}
        <div style={{ padding: '0 2rem', marginTop: '2rem' }}>
          <BentoGallery />
        </div>
      </section>


      {/* --- TESTIMONIALS --- */}
      <section className="testimonials" id="reviews">
        <div className="container"><Reveal><h2 className="section-title">HAPPY CLIENTS</h2></Reveal></div>

        {/* Row 1 */}
        <div className="testimonial-track" style={{ marginBottom: '30px' }}>
          {[...Array(4)].map((_, widthIndex) => (
            <div key={`track1-${widthIndex}`} style={{ display: 'flex', gap: '30px' }}>
              {[
                { name: "Sudarshan Divekar", title: "Founder of GlassMate Media", review: "Exceptional creativity and execution. They truly understood our brand vision.", color: "#555" },
                { name: "Ayush Jain", title: "Founder at Grofo Foundation", review: "We've worked with many designers, but the quality here is unmatched.", color: "#777" },
                { name: "Taha Kothari", title: "Hatimi Retreats", review: "A game-changer for our visual identity. Highly recommended.", color: "#444" }
              ].map((client, index) => (
                <div key={index} className="review-card glass-panel">
                  <div className="client-header">
                    <div className="client-avatar" style={{ background: client.color }}></div>
                    <div><h4>{client.name}</h4><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{client.title}</span></div>
                  </div>
                  <p style={{ color: 'var(--text-muted)' }}>&quot;{client.review}&quot;</p>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Row 2 */}
        <div className="testimonial-track reverse">
          {[...Array(4)].map((_, widthIndex) => (
            <div key={`track2-${widthIndex}`} style={{ display: 'flex', gap: '30px' }}>
              {[
                { name: "Ujjwal Bahl", title: "Stealth Startup", review: "Incredible attention to detail and professional delivery.", color: "#888" },
                { name: "Manish Modal", title: "Co Founder at Stratezic", review: "The strategic approach to design helped us scale effectively.", color: "#666" },
                { name: "Pulkit Todi", title: "CEO of Stratezic", review: "Top-tier work that consistently exceeds expectations.", color: "#999" }
              ].map((client, index) => (
                <div key={index} className="review-card glass-panel">
                  <div className="client-header">
                    <div className="client-avatar" style={{ background: client.color }}></div>
                    <div><h4>{client.name}</h4><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{client.title}</span></div>
                  </div>
                  <p style={{ color: 'var(--text-muted)' }}>&quot;{client.review}&quot;</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* --- ABOUT & FAQ --- */}
      <section className="container" id="about" style={{ padding: 'var(--section-padding)' }}>
        <Reveal className="about-split">
          <div>
            <h2 style={{ fontSize: '3rem', marginBottom: '10px' }}>Manan Shah</h2>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '20px', fontWeight: 500 }}>Hi, I’m a Creative Designer & Visual Editor</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '30px' }}>
              I turn ideas into polished visuals that communicate, captivate, and convert. From branding and ad creatives to cinematic edits, I bring a detail-driven approach that blends design strategy with storytelling. My goal? To make every frame feel intentional and every project look world-class.
            </p>
            <div className="stats-grid">
              <div className="stat-item"><h3>100+</h3><p>Projects</p></div>
              <div className="stat-item"><h3>4+</h3><p>Years Exp</p></div>
            </div>
          </div>
          <FAQ />
        </Reveal>
      </section>

      {/* --- CONTACT --- */}
      <section className="contact-section" id="contact">
        <div className="container">
          <Reveal className="glass-panel" style={{ padding: '60px' }}>
            <div className="contact-grid">
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div>
                  <h2>Let&apos;s Talk</h2>
                  <p style={{ color: 'var(--text-muted)', marginTop: '10px', marginBottom: '30px' }}>Ready to start your transformation?</p>
                  <p style={{ lineHeight: 1.8 }}>transcendframes@gmail.com</p>
                </div>
                <div style={{ display: 'flex', gap: '15px', marginTop: 'auto', paddingTop: '30px' }}>
                  <a href="https://www.instagram.com/transcend.frames/" target="_blank" rel="noopener noreferrer" className="social-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                  </a>
                  <a href="https://www.linkedin.com/company/transcend-frames/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="social-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                  </a>
                  <a href="https://www.youtube.com/@mananshahstudio" target="_blank" rel="noopener noreferrer" className="social-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
                  </a>
                  <a href="https://behance.net" target="_blank" rel="noopener noreferrer" className="social-btn">
                    <img src="/BehanceLogo.png" alt="Behance" width="20" height="20" style={{ objectFit: 'contain', filter: 'var(--invert-icon)' }} />
                  </a>
                  <a href="https://linktr.ee/MananPortfolio" target="_blank" rel="noopener noreferrer" className="social-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                  </a>
                </div>
              </div>
              <form>
                <div className="form-group">
                  <input
                    type="text"
                    className="minimal-input"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    className="minimal-input"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="minimal-input"
                    placeholder="Project Details"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
                <div style={{ marginTop: '20px' }}>
                  <StarBorder as="button" className="filled" type="button" onClick={handleSendEmail} color="#fff" speed="5s">
                    Send Message
                  </StarBorder>
                </div>
              </form>

            </div>
          </Reveal>
        </div>
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.6}
          amplitude={1.0}
          speed={0.5}
        />
      </section>

      {/* --- FOOTER --- */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '30px 0', background: '#000', position: 'relative', zIndex: 10 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>

          {/* Left: Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/globe.svg" width="24" height="24" alt="Icon" style={{ filter: 'invert(1)' }} />
            <span style={{ fontWeight: 600, fontSize: '1.1rem', color: '#fff' }}>Transcend Frames 2026</span>
          </div>

          {/* Center: Credits */}
          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
            Made with <span style={{ color: '#F43F5E' }}>&hearts;</span> by Manan Shah
          </div>

          {/* Right spacer to balance layout if needed, or leave empty. Flex space-between handles left item. */}
          <div></div>
        </div>
      </footer>

    </main>
  );
}