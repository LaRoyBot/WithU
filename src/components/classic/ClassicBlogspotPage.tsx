'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ClassicBlogspotPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; bg: string; color: string } | null>(null);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: 'Submitting...', bg: 'beige', color: 'green' });

    const form = e.currentTarget;
    const formData = new FormData(form);
    const keyValuePairs: string[] = [];
    for (const [key, val] of formData.entries()) {
      keyValuePairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(val))}`);
    }
    const formDataString = keyValuePairs.join('&');

    try {
      await fetch(
        'https://script.google.com/macros/s/AKfycbw7FKhJirsHSIJuw6MVhn0Mj1t3M1Q6UMcaz2iENm_fD1mFixSrMJf9u3qAs4TVXpJb/exec',
        {
          redirect: 'follow',
          method: 'POST',
          body: formDataString,
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
        }
      );
      setMessage({ text: 'Data submitted successfully!', bg: 'green', color: 'beige' });
      form.reset();
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({ text: 'An error occurred while submitting the form.', bg: '#ffebee', color: '#c62828' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="classic-blogspot-root">
      <style jsx global>{`
        .classic-blogspot-root {
          font-family: Arial, Helvetica, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #fff;
          color: #333;
        }
        .classic-blogspot-root header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: white;
          padding: 10px 20px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .classic-blogspot-root .logo-container {
          display: flex;
          align-items: center;
        }
        .classic-blogspot-root .logo {
          width: 80px;
          height: 80px;
          margin-right: 20px;
        }
        .classic-blogspot-root .company-name {
          font-size: 32px;
          color: #008080;
          font-weight: bold;
        }
        @media (max-width: 768px) {
          .classic-blogspot-root .company-name {
            font-size: 20px;
          }
          .classic-blogspot-root .contact-number {
            font-size: 18px !important;
          }
          .classic-blogspot-root header {
            flex-direction: column;
            gap: 10px;
          }
        }
        .classic-blogspot-root .header-right {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .classic-blogspot-root .download-btn {
          background-color: #ff9800;
          padding: 8px 16px;
          color: #fff;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          font-size: 14px;
        }
        .classic-blogspot-root .portal-btn {
          background-color: #008080;
          padding: 8px 16px;
          color: #fff;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          font-size: 13px;
        }
        .classic-blogspot-root .contact-number {
          font-size: 24px;
          color: #008080;
          font-weight: bold;
        }
        .classic-blogspot-root .icons {
          display: flex;
          justify-content: center;
          margin-top: 8px;
          background-color: #008080;
          padding: 8px;
          flex-wrap: wrap;
        }
        .classic-blogspot-root .icon {
          padding: 10px 20px;
          margin: 0 10px;
          border-radius: 6px;
          color: white;
          font-size: 15px;
          cursor: pointer;
          position: relative;
          text-decoration: none;
        }
        .classic-blogspot-root .icon:hover {
          background-color: #005577;
        }
        .classic-blogspot-root .carousel-container {
          position: relative;
          width: 100%;
          min-height: 480px;
          overflow: hidden;
          background: #222;
        }
        .classic-blogspot-root .carousel-images {
          display: flex;
          width: 200%;
          animation: classicCarousel 30s infinite;
        }
        .classic-blogspot-root .carousel-images img {
          width: 50%;
          height: 520px;
          object-fit: cover;
        }
        @keyframes classicCarousel {
          0% { transform: translateX(0); }
          45% { transform: translateX(0); }
          50% { transform: translateX(-50%); }
          95% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .classic-blogspot-root .enquiry-form-container {
          position: absolute;
          top: 50%;
          right: 8%;
          transform: translateY(-50%);
          background-color: rgba(0, 0, 0, 0.75);
          padding: 24px;
          border-radius: 8px;
          color: white;
          width: 90%;
          max-width: 320px;
          z-index: 10;
        }
        @media (max-width: 900px) {
          .classic-blogspot-root .enquiry-form-container {
            position: relative;
            top: auto;
            right: auto;
            transform: none;
            margin: -60px auto 40px;
            background: rgba(0, 80, 80, 0.95);
          }
        }
        .classic-blogspot-root .enquiry-form-container h2 {
          text-align: center;
          margin-bottom: 15px;
          font-size: 22px;
          color: white;
          font-weight: bold;
        }
        .classic-blogspot-root .enquiry-form-container input,
        .classic-blogspot-root .enquiry-form-container select,
        .classic-blogspot-root .enquiry-form-container textarea,
        .classic-blogspot-root .enquiry-form-container button {
          width: 100%;
          padding: 10px;
          margin-bottom: 12px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
        }
        .classic-blogspot-root .enquiry-form-container button {
          background-color: #ff8c00;
          color: white;
          cursor: pointer;
          font-weight: bold;
          border: none;
        }
        .classic-blogspot-root .enquiry-form-container button:hover {
          background-color: #e07b00;
        }
        .classic-blogspot-root .chart-title {
          text-align: center;
          margin: 50px 20px 20px;
        }
        .classic-blogspot-root .chart-title h1 {
          font-size: 32px;
          color: #008080;
          margin-bottom: 8px;
        }
        .classic-blogspot-root .chart-title p {
          color: #666;
          font-size: 16px;
        }
        .classic-blogspot-root .testimonials {
          display: flex;
          flex-wrap: wrap;
          gap: 25px;
          padding: 20px;
          justify-content: center;
          max-width: 1200px;
          margin: 0 auto;
        }
        .classic-blogspot-root .testimonial {
          background-color: #f9f9f9;
          padding: 20px;
          width: 260px;
          text-align: center;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        .classic-blogspot-root .testimonial img {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          margin: 0 auto 15px;
          object-fit: cover;
          display: block;
        }
        .classic-blogspot-root .testimonial p {
          font-style: italic;
          color: #008080;
          font-size: 13px;
          line-height: 1.6;
          text-align: justify;
        }
        .classic-blogspot-root .org-chart {
          display: flex;
          justify-content: center;
          gap: 30px;
          flex-wrap: wrap;
          margin: 30px auto 60px;
          max-width: 1000px;
          padding: 0 20px;
        }
        .classic-blogspot-root .org-member {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          width: 260px;
          text-align: center;
          padding: 25px 20px;
          border-top: 4px solid #008080;
        }
        .classic-blogspot-root .org-member img {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          margin: 0 auto 15px;
          object-fit: cover;
          display: block;
        }
        .classic-blogspot-root .org-member h3 {
          font-size: 18px;
          color: #333;
          margin-bottom: 5px;
        }
        .classic-blogspot-root .org-member p {
          font-size: 13px;
          color: #666;
          margin: 4px 0;
        }
        .classic-blogspot-root footer {
          display: flex;
          justify-content: space-around;
          padding: 40px 20px 20px;
          background-color: #008080;
          color: white;
          flex-wrap: wrap;
          gap: 30px;
        }
        .classic-blogspot-root .footer-services {
          min-width: 180px;
        }
        .classic-blogspot-root .footer-services h3 {
          font-size: 16px;
          margin-bottom: 15px;
          border-bottom: 2px solid rgba(255,255,255,0.3);
          padding-bottom: 5px;
        }
        .classic-blogspot-root .footer-services ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .classic-blogspot-root .footer-services ul li {
          margin: 8px 0;
          font-size: 13px;
        }
        .classic-blogspot-root .footer-copy {
          text-align: center;
          margin-top: 30px;
          width: 100%;
          font-size: 12px;
          border-top: 1px solid rgba(255,255,255,0.2);
          padding-top: 15px;
        }
        .classic-blogspot-root .whatsapp-btn {
          position: fixed;
          bottom: 25px;
          right: 25px;
          background-color: #25d366;
          color: white;
          padding: 12px 20px;
          font-size: 16px;
          font-weight: bold;
          border-radius: 50px;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
          text-decoration: none;
          z-index: 999;
        }
      `}</style>

      {/* Header Section */}
      <header>
        <div className="logo-container">
          <img
            alt="Company Logo"
            className="logo"
            src="https://lh3.googleusercontent.com/J182IL7UFYLEkNSPgfiI2CrC13URd4BpFHZL2r8xv2A42XWYCr_-BYiXm1sY-9ooHetGlawx9_DTiEIQew=s265-w265-h265-rw"
          />
          <span className="company-name">Neetha Nursing Service at Home</span>
        </div>
        <div className="header-right">
          <a className="download-btn" href="tel:+919397925412">
            📞 93 979 254 12
          </a>
          <span className="contact-number">83 410 696 93</span>
          <a
            href="https://n.neethanursing.in"
            className="portal-btn"
            title="Access the new online booking and care portal"
          >
            Go to Modern Portal ➔
          </a>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="icons">
        <a href="#services" className="icon">Services</a>
        <a href="#about" className="icon">About</a>
        <a href="#team" className="icon">Our Team</a>
        <a href="#book" className="icon">Book Now</a>
        <button
          className="icon"
          style={{ background: 'transparent', border: 'none' }}
          onClick={() => setModalOpen(true)}
        >
          Admin Login
        </button>
        <a
          href="https://n.neethanursing.in/employee/login"
          className="icon"
          style={{ backgroundColor: '#ff8c00', fontWeight: 'bold' }}
        >
          Caregiver Portal
        </a>
      </nav>

      {/* Hero Carousel & Floating Booking Form */}
      <div className="carousel-container" id="book">
        <div className="carousel-images">
          <img
            alt="Neetha Nursing Care"
            src="https://lh3.googleusercontent.com/pbd3_a33HXaniCU_iNS5pi5Vap5hc9r4DUQ1C1k0mZf8R-2itbglokusVm3A8p2j8Pk7DkVZrQgW8qX5VQ=s265-w265-h265-rw"
          />
          <img
            alt="Patient Care at Home"
            src="https://lh3.googleusercontent.com/NJTeELVUwXP4chHqK3RMuJZcFogavFy2a-c9pg2vBWDS-6UIx_CR_eYzFoYt8--iCeJ9FQCPFS7_0LK_vg=s265-w265-h265-rw"
          />
        </div>

        {/* Enquiry Form */}
        <div className="enquiry-form-container">
          <h2>Book Now</h2>
          <form id="form" onSubmit={handleFormSubmit}>
            <div>
              <input
                type="text"
                placeholder="Your Name"
                name="Your Name"
                required
              />
            </div>
            <div>
              <input
                type="tel"
                placeholder="Phone Number"
                name="Phone Number"
                required
              />
            </div>
            <div>
              <select name="service_choice" defaultValue="" required>
                <option value="" disabled>Select a Service</option>
                <option value="IM">IM Injections 299</option>
                <option value="IV">IV Injections 399</option>
                <option value="wound">Wound Dressing 399</option>
                <option value="Urine">Urine Pipe Change 799</option>
                <option value="Nurse">Nurse 24/7 2999</option>
              </select>
            </div>
            <div>
              <input
                type="text"
                placeholder="Service or Locality Details"
                name="service"
              />
            </div>
            <div>
              <textarea
                rows={2}
                placeholder="Message or specific patient conditions"
                name="Message"
              />
            </div>
            <div>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>

          {message && (
            <div
              style={{
                margin: '10px 0',
                padding: '8px',
                borderRadius: '4px',
                backgroundColor: message.bg,
                color: message.color,
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: '12px',
              }}
            >
              {message.text}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '11px' }}>
            Looking for instant UPI confirmation?{' '}
            <a
              href="https://n.neethanursing.in/booking"
              style={{ color: '#ffb74d', textDecoration: 'underline', fontWeight: 'bold' }}
            >
              Book via Modern Portal
            </a>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="chart-title" id="services">
        <h1>Our Services</h1>
        <p>All These Services are Provided at Your Home</p>
      </div>

      <section className="testimonials">
        <div className="testimonial">
          <img
            alt="Injection Service"
            src="https://lh3.googleusercontent.com/Saib3HojfInq_W_swi4SgDtOCLxmGH4mI3kG5OK5bzuVAv2vvuTVI5vV_9coVqBsRZv4ziea_84pUmoC2A=s265-w265-h265-rw"
          />
          <p>
            Looking for professional, safe, and affordable injections service at home just Rs299? Our certified and experienced nurse injectors are here to provide high-quality care and deliver exceptional results.
          </p>
        </div>

        <div className="testimonial">
          <img
            alt="Wound Dressing Service"
            src="https://lh3.googleusercontent.com/wNLkSKxk2Cmwl8Lx5vFWSPaawr6kZ1xH8CIp8I6sZePORd5cwGbRtp-T6ZPsmpidrQg8F9SAIOmHGdC0kA=s265-w265-h265-rw"
          />
          <p>
            Looking for expert wound dressing and surgical dressing services? Our team of licensed and skilled nurses specializes in the care and management of wounds, ensuring you receive top-quality, safe, and effective treatment.
          </p>
        </div>

        <div className="testimonial">
          <img
            alt="Catheterization Service"
            src="https://lh3.googleusercontent.com/lWxxfDMTHcRb4KNU0X1wpyh4EgTrtKs2BV1CXTACQM3fXu1Kz-YrNXuYNHcPK2pHp-6Soiqp9WFJu2BsjA=s265-w265-h265-rw"
          />
          <p>
            Looking for reliable, professional urine pipe change and catheterization services? Our team of certified and skilled nurses specializes in providing safe and efficient urinary catheterization and urine pipe change services.
          </p>
        </div>

        <div className="testimonial">
          <img
            alt="IV Infusion Therapy"
            src="https://lh3.googleusercontent.com/nTa4Ms1E96zUzea9tvlanivCwyhnukUToxNrBV4GpEYNxml0AKAj6wNK1cbyfXE8O4lsTXPAGcBspU86gw=s265-w265-h265-rw"
          />
          <p>
            Looking for reliable IV infusion therapy and saline drips at the comfort of your home? Our home-based IV hydration service brings personalized treatment directly to your doorstep.
          </p>
        </div>

        <div className="testimonial">
          <img
            alt="At-Home IVF Support"
            src="https://lh3.googleusercontent.com/_ij54-AorD3WxXzEZIG6xtXmG84j5yvRq5En_8ulYLzTd5Xsq_ZywmzEsronx9SPYkBNl8MQ3x9tc9I7hQ=s265-w265-h265-rw"
          />
          <p>
            Looking for professional IVF injection services at the comfort of your home? Our at-home IVF injection service offers a safe, convenient, and private option for patients undergoing in vitro fertilization treatment.
          </p>
        </div>

        <div className="testimonial">
          <img
            alt="Post-Surgical Care"
            src="https://lh3.googleusercontent.com/xaKGRde8fPuAy5IPGKFLTLXjEFy4lkilQgjxlJXPxGQ0Dih594Ln4XnHwZLgqHfRO0yFTNOdnrV8k67Oaw=s265-w265-h265-rw"
          />
          <p>
            After surgery, receiving the right nursing care is essential to ensure a smooth and safe recovery. Our post-surgical nursing care services provide professional, compassionate care tailored to your unique needs.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <div className="chart-title" id="team">
        <h1>Our Team</h1>
        <p>Meet the Key Members of Our Organization</p>
      </div>

      <section className="org-chart">
        <div className="org-member">
          <img
            alt="Sunitha Yelamarthi"
            src="https://lh3.googleusercontent.com/NYx_F19A6LPXclmwfhhoIoxMuiR4qN4qS9eSTW_UXitdG9RZo2tlKPBLqTVsMG7yEpYbba-eLz4yrj8ZlQ=s265-w265-h265-rw"
          />
          <h3>Sunitha Yelamarthi</h3>
          <p style={{ color: '#008080', fontWeight: 'bold' }}>CEO - Chief Executive Officer</p>
          <p>16+ Years of Clinical Experience</p>
        </div>

        <div className="org-member">
          <img
            alt="Mareswara Rao"
            src="https://lh3.googleusercontent.com/WS5ec-h2gbrxkhYDVVykMtdj8Yd3Bxg6JnfkyP0WElnwlUTSCA97kiwS0CmwdAV9MNlmVoYzUpHYqGcFOA=s265-w265-h265-rw"
          />
          <h3>Mareswara Rao</h3>
          <p style={{ color: '#008080', fontWeight: 'bold' }}>CTO - Chief Technology Officer</p>
          <p>Technical & Operations Lead</p>
        </div>

        <div className="org-member">
          <img
            alt="Prabhakar Rao"
            src="https://lh3.googleusercontent.com/oDUKUl6NEyfOqOZuES2eGISF0S4YzSPVYZ9zgVjE_SeWam0Pf9DcUiCqzgcFWEQ7SXDE88RavHKOqiE1LQ=s265-w265-h265-rw"
          />
          <h3>Prabhakar Rao</h3>
          <p style={{ color: '#008080', fontWeight: 'bold' }}>COO - Chief Operating Officer</p>
          <p>25+ Years of Healthcare Operations</p>
        </div>
      </section>

      {/* Footer Section */}
      <footer id="about">
        <div className="footer-services">
          <h3>Services</h3>
          <ul>
            <li>Injections (IM/IV)</li>
            <li>Vaccination & Saline</li>
            <li>Post-Surgical Care</li>
            <li>Wound & Ulcer Dressing</li>
            <li>Urinary Catheterization</li>
            <li>IV Infusion Therapy</li>
          </ul>
        </div>

        <div className="footer-services">
          <h3>Why Us</h3>
          <ul>
            <li>Experienced Certified Staff</li>
            <li>Strict Hygiene Protocol</li>
            <li>Doorstep Service in 30-45 Mins</li>
            <li>Thousands of Happy Families</li>
          </ul>
        </div>

        <div className="footer-services">
          <h3>Operating Areas</h3>
          <ul>
            <li>Lingampally & BHEL</li>
            <li>Gachibowli & Kondapur</li>
            <li>Miyapur & Chandanagar</li>
            <li>Madhapur & Hitec City</li>
          </ul>
        </div>

        <div className="footer-services">
          <h3>Contact Us</h3>
          <ul>
            <li>Phone: +91 8341069693</li>
            <li>Phone: +91 9397925412</li>
            <li>Email: maresh436@gmail.com</li>
            <li>Hyderabad, Telangana</li>
          </ul>
        </div>

        <div className="footer-copy">
          <p>&copy; {new Date().getFullYear()} Neetha Nursing Service at Home. All rights reserved.</p>
        </div>
      </footer>

      {/* Floating WhatsApp Action */}
      <a className="whatsapp-btn" href="https://wa.me/+918341069693" target="_blank" rel="noopener noreferrer">
        <img
          alt="WhatsApp"
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          style={{ width: '24px', height: '24px' }}
        />
        Chat on WhatsApp
      </a>

      {/* Simple Login Dialog */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '8px',
              width: '90%',
              maxWidth: '320px',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: '15px', color: '#008080' }}>Staff & Admin Access</h3>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '20px' }}>
              Access the centralized coordination and caregiver marketplace.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a
                href="https://n.neethanursing.in/admin/login"
                style={{
                  backgroundColor: '#008080',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '13px',
                }}
              >
                Go to Admin Portal ➔
              </a>
              <a
                href="https://n.neethanursing.in/employee/login"
                style={{
                  backgroundColor: '#333',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '13px',
                }}
              >
                Go to Staff Login ➔
              </a>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#999',
                  cursor: 'pointer',
                  marginTop: '10px',
                  fontSize: '12px',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
