'use client';

import React, { useEffect } from 'react';

export default function ClassicBlogspotPage() {
  useEffect(() => {
    // 1. Setup Login Modal Interactions
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeBtn = document.getElementById('closeBtn');
    const loginForm = document.getElementById('loginForm');

    if (loginBtn && loginModal) {
      loginBtn.onclick = () => {
        loginModal.style.display = 'flex';
      };
    }

    if (closeBtn && loginModal) {
      closeBtn.onclick = () => {
        loginModal.style.display = 'none';
      };
    }

    const handleWindowClick = (event: MouseEvent) => {
      if (loginModal && event.target === loginModal) {
        loginModal.style.display = 'none';
      }
    };
    window.addEventListener('click', handleWindowClick);

    if (loginForm) {
      loginForm.onsubmit = (event) => {
        event.preventDefault();
        const usernameInput = document.getElementById('username') as HTMLInputElement;
        const passwordInput = document.getElementById('password') as HTMLInputElement;
        const username = usernameInput?.value;
        const password = passwordInput?.value;

        if (username && password) {
          alert(`Username: ${username}\nPassword: ${password}`);
          if (loginModal) loginModal.style.display = 'none';
        } else {
          alert('Please fill in both fields.');
        }
      };
    }

    // 2. Setup Google Apps Script Form Submission
    const bookingForm = document.getElementById('form');
    const messageBox = document.getElementById('message');
    const submitButton = document.getElementById('submit-button') as HTMLButtonElement;

    if (bookingForm) {
      const handleBookingSubmit = function (e: Event) {
        e.preventDefault();
        if (messageBox) {
          messageBox.textContent = 'Submitting..';
          messageBox.style.display = 'block';
          messageBox.style.backgroundColor = 'beige';
          messageBox.style.color = 'green';
        }
        if (submitButton) submitButton.disabled = true;

        const formData = new FormData(bookingForm as HTMLFormElement);
        const keyValuePairs: string[] = [];
        for (const [key, value] of formData.entries()) {
          keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value as string));
        }
        const formDataString = keyValuePairs.join('&');

        fetch(
          'https://script.google.com/macros/s/AKfycbw7FKhJirsHSIJuw6MVhn0Mj1t3M1Q6UMcaz2iENm_fD1mFixSrMJf9u3qAs4TVXpJb/exec',
          {
            redirect: 'follow',
            method: 'POST',
            body: formDataString,
            headers: {
              'Content-Type': 'text/plain;charset=utf-8',
            },
          }
        )
          .then((response) => {
            if (response) {
              if (messageBox) {
                messageBox.textContent = 'Data submitted successfully!';
                messageBox.style.display = 'block';
                messageBox.style.backgroundColor = 'green';
                messageBox.style.color = 'beige';
              }
              if (submitButton) submitButton.disabled = false;
              (bookingForm as HTMLFormElement).reset();

              setTimeout(() => {
                if (messageBox) {
                  messageBox.textContent = '';
                  messageBox.style.display = 'none';
                }
              }, 2600);
            } else {
              throw new Error('Failed to submit the form.');
            }
          })
          .catch((error) => {
            console.error(error);
            if (messageBox) {
              messageBox.textContent = 'An error occurred while submitting the form.';
              messageBox.style.display = 'block';
              messageBox.style.backgroundColor = '#ffebee';
              messageBox.style.color = '#c62828';
            }
            if (submitButton) submitButton.disabled = false;
          });
      };

      bookingForm.addEventListener('submit', handleBookingSubmit);
      return () => {
        window.removeEventListener('click', handleWindowClick);
        bookingForm.removeEventListener('submit', handleBookingSubmit);
      };
    }

    return () => {
      window.removeEventListener('click', handleWindowClick);
    };
  }, []);

  return (
    <div className="blogspot-exact-root">
      {/* Exact Inlined Styles from User Code */}
      <style jsx global>{`
        .blogspot-exact-root * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: Arial, Helvetica, sans-serif;
        }

        .blogspot-exact-root header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: white;
          padding: 10px 20px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .blogspot-exact-root .logo-container {
          display: flex;
          align-items: center;
        }

        .blogspot-exact-root .logo {
          width: 80px;
          height: 80px;
          margin-right: 20px;
        }

        .blogspot-exact-root .company-name {
          font-size: 37px;
          color: #008080;
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .blogspot-exact-root .company-name {
            font-size: 22px;
          }
          .blogspot-exact-root .contact-number {
            font-size: 18px !important;
          }
          .blogspot-exact-root header {
            flex-direction: column;
            gap: 10px;
          }
        }

        .blogspot-exact-root .header-right {
          display: flex;
          align-items: center;
        }

        .blogspot-exact-root .download-btn {
          background-color: orange;
          padding: 10px 20px;
          color: blue;
          text-decoration: none;
          border-radius: 5px;
          margin-right: 20px;
          font-weight: bold;
        }

        .blogspot-exact-root .contact-number {
          font-size: 30px;
          color: #008080;
          font-weight: bold;
        }

        .blogspot-exact-root .login-btn {
          background-color: #008080;
          color: white;
          border: none;
          cursor: pointer;
          font-size: 16px;
        }

        .blogspot-exact-root .login-btn:hover {
          background-color: #008080;
        }

        .blogspot-exact-root .modal {
          display: none;
          position: fixed;
          z-index: 1000;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.4);
          justify-content: center;
          align-items: center;
        }

        .blogspot-exact-root .modal-content {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          width: 300px;
          text-align: center;
          position: relative;
        }

        .blogspot-exact-root .modal-content input {
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        .blogspot-exact-root .modal-content button {
          background-color: #333;
          color: white;
          padding: 10px 20px;
          border: none;
          cursor: pointer;
          font-size: 16px;
          border-radius: 5px;
          width: 100%;
        }

        .blogspot-exact-root .modal-content button:hover {
          background-color: #008080;
        }

        .blogspot-exact-root .close-btn {
          position: absolute;
          top: 10px;
          right: 15px;
          font-size: 24px;
          font-weight: bold;
          color: #333;
          cursor: pointer;
        }

        .blogspot-exact-root .icons {
          display: flex;
          justify-content: center;
          margin-top: 8px;
          background-color: #008080;
          padding: 8px;
        }

        .blogspot-exact-root .icon {
          padding: 10px;
          margin: 0 20px;
          border-radius: 10px;
          color: white;
          font-size: 16px;
          cursor: pointer;
          position: relative;
          transition: background-color 0.4s ease;
        }

        .blogspot-exact-root .icon:hover {
          background-color: #005577;
        }

        .blogspot-exact-root .icon:hover .dropdown {
          display: block;
        }

        .blogspot-exact-root .dropdown {
          display: none;
          position: absolute;
          top: 30px;
          left: 50%;
          transform: translateX(-50%);
          background-color: white;
          color: #333;
          padding: 10px;
          border: 1px solid #ddd;
          width: 120px;
          z-index: 10;
        }

        .blogspot-exact-root .dropdown a {
          padding: 8px;
          text-decoration: none;
          color: #333;
          display: block;
        }

        .blogspot-exact-root .dropdown a:hover {
          background-color: #ddd;
        }

        .blogspot-exact-root .carousel-container {
          position: relative;
          width: 100%;
          min-height: 480px;
          overflow: hidden;
        }

        .blogspot-exact-root .carousel-images {
          display: flex;
          width: 200%;
          animation: carousel 50s infinite;
        }

        .blogspot-exact-root .carousel-images img {
          width: 50%;
          height: 90vh;
          min-height: 480px;
          object-fit: cover;
        }

        @keyframes carousel {
          0% { transform: translateX(0); }
          50% { transform: translateX(-50%); }
          50.01% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        .blogspot-exact-root .enquiry-form-container {
          position: absolute;
          top: 45%;
          left: 70%;
          transform: translate(-50%, -50%);
          background-color: rgba(0, 0, 0, 0.5);
          padding: 30px;
          border-radius: 5px;
          color: White;
          width: 80%;
          max-width: 320px;
          z-index: 20;
        }

        @media (max-width: 900px) {
          .blogspot-exact-root .enquiry-form-container {
            position: relative;
            top: auto;
            left: auto;
            transform: none;
            margin: -40px auto 30px;
            background-color: rgba(0, 128, 128, 0.95);
          }
          .blogspot-exact-root .carousel-images img {
            height: 50vh;
            min-height: 320px;
          }
        }

        .blogspot-exact-root .enquiry-form-container h2 {
          text-align: center;
          margin-bottom: 20px;
          color: White;
        }

        .blogspot-exact-root .enquiry-form-container input,
        .blogspot-exact-root .enquiry-form-container select,
        .blogspot-exact-root .enquiry-form-container textarea,
        .blogspot-exact-root .enquiry-form-container button {
          width: 100%;
          padding: 10px;
          margin-bottom: 15px;
          border: none;
          border-radius: 5px;
          font-size: 1rem;
        }

        .blogspot-exact-root .enquiry-form-container input,
        .blogspot-exact-root .enquiry-form-container select,
        .blogspot-exact-root .enquiry-form-container textarea {
          background-color: #fff;
          color: #333;
        }

        .blogspot-exact-root .enquiry-form-container button {
          background-color: #ff8c00;
          color: white;
          cursor: pointer;
          font-weight: bold;
        }

        .blogspot-exact-root .enquiry-form-container button:hover {
          background-color: #e07b00;
        }

        .blogspot-exact-root .testimonials {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-top: 40px;
          justify-content: center;
          padding: 0 20px;
        }

        .blogspot-exact-root .testimonial {
          background-color: #f9f9f9;
          padding: 20px;
          width: 260px;
          text-align: justify;
          border-radius: 5px;
        }

        .blogspot-exact-root .testimonial img {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          margin: 0 auto 15px;
          display: block;
          object-fit: cover;
        }

        .blogspot-exact-root .testimonial p {
          font-style: italic;
          color: #008080;
          font-size: 13px;
          line-height: 1.5;
        }

        .blogspot-exact-root .whatsapp-btn {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background-color: #25d366;
          color: white;
          padding: 15px 20px;
          font-size: 18px;
          border-radius: 50px;
          display: flex;
          align-items: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-decoration: none;
          z-index: 800;
        }

        .blogspot-exact-root .whatsapp-btn img {
          width: 30px;
          height: 30px;
          margin-right: 10px;
        }

        .blogspot-exact-root .whatsapp-btn:hover {
          background-color: #128C7E;
          transition: background-color 0.3s;
        }

        .blogspot-exact-root footer {
          display: flex;
          justify-content: space-around;
          padding: 30px 20px;
          background-color: #008080;
          color: white;
          flex-wrap: wrap;
          margin-top: 40px;
        }

        .blogspot-exact-root .footer-services ul {
          list-style: none;
          margin-top: 10px;
        }

        .blogspot-exact-root .footer-services ul li {
          margin: 8px 0;
          font-size: 13px;
        }

        .blogspot-exact-root .footer-copy {
          align-self: flex-end;
          text-align: center;
          margin-top: 20px;
          width: 100%;
          font-size: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          padding-top: 15px;
        }

        .blogspot-exact-root .org-chart {
          display: flex;
          justify-content: center;
          gap: 25px;
          align-items: center;
          margin: 40px auto;
          flex-wrap: wrap;
          padding: 0 20px;
        }

        .blogspot-exact-root .org-member {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          width: 250px;
          text-align: center;
          padding: 20px;
          transition: transform 0.3s ease;
        }

        .blogspot-exact-root .org-member:hover {
          transform: scale(1.05);
        }

        .blogspot-exact-root .org-member img {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          margin-bottom: 15px;
          object-fit: cover;
        }

        .blogspot-exact-root .org-member p {
          font-size: 13px;
          color: #555;
          margin-top: 4px;
        }

        .blogspot-exact-root .chart-title {
          text-align: center;
          font-size: 28px;
          color: #008080;
          margin: 40px 0 20px;
        }
      `}</style>

      {/* Header Section */}
      <header>
        <div className="logo-container">
          <img
            src="https://lh3.googleusercontent.com/J182IL7UFYLEkNSPgfiI2CrC13URd4BpFHZL2r8xv2A42XWYCr_-BYiXm1sY-9ooHetGlawx9_DTiEIQew=s265-w265-h265"
            alt="Company Logo"
            className="logo"
          />
          <span className="company-name">Neetha Nursing Service at Home</span>
        </div>
        <div className="header-right">
          <a href="tel:+919397925412" className="download-btn">93 979 254 12</a>
          <span> &#128222; </span>
          <span className="contact-number"> 93 979 254 12 </span>
        </div>
      </header>

      {/* Icon Section */}
      <section className="icons">
        <div className="icon">
          Home
          <div className="dropdown">
            <a href="#services">Services</a>
            <a href="#team">Our Team</a>
            <a href="https://n.neethanursing.in">Modern Portal</a>
          </div>
        </div>
        <div className="icon">
          About
          <div className="dropdown">
            <a href="#team">Our Team</a>
            <a href="https://n.neethanursing.in/about">Full Story</a>
          </div>
        </div>
        <div className="icon">
          Services
          <div className="dropdown">
            <a href="#services">Home Services</a>
            <a href="https://n.neethanursing.in/services">All Packages</a>
          </div>
        </div>
        <div className="icon">
          <button className="login-btn" id="loginBtn">Admin</button>
        </div>
      </section>

      {/* Carousel Section */}
      <div className="carousel-container">
        <div className="carousel-images">
          <img
            src="https://lh3.googleusercontent.com/pbd3_a33HXaniCU_iNS5pi5Vap5hc9r4DUQ1C1k0mZf8R-2itbglokusVm3A8p2j8Pk7DkVZrQgW8qX5VQ=s265-w265-h265"
            alt="Image 1"
          />
          <img
            src="https://lh3.googleusercontent.com/NJTeELVUwXP4chHqK3RMuJZcFogavFy2a-c9pg2vBWDS-6UIx_CR_eYzFoYt8--iCeJ9FQCPFS7_0LK_vg=s265-w265-h265"
            alt="Image 2"
          />
          <img
            src="https://lh3.googleusercontent.com/_ij54-AorD3WxXzEZIG6xtXmG84j5yvRq5En_8ulYLzTd5Xsq_ZywmzEsronx9SPYkBNl8MQ3x9tc9I7hQ=s265-w265-h265"
            alt="Image 3"
          />
          <img
            src="https://lh3.googleusercontent.com/YBjw1meMuoJQo1xEvpRKgzJl2HFBU5Whn-pq5eEQiSQe62QSZZA59mFEHQFXE0ZGZGyFmt_eCs5SRsYesQ=s265-w265-h265"
            alt="Image 4"
          />
        </div>
      </div>

      {/* Enquiry Form Section */}
      <div className="enquiry-form-container">
        <h2 style={{ fontSize: '150%' }}>Book Now</h2>
        <form id="form" className="container m-4 pl-4" method="POST">
          <div className="field">
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="Your Name"
                name="Your Name"
                required
              />
            </div>
          </div>

          <div className="field">
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="Phone Number"
                name="Phone Number"
                required
              />
            </div>
          </div>

          <div className="field">
            <div className="control">
              <select defaultValue="getone" required>
                <option value="getone" disabled>Select a Service</option>
                <option value="IM">IM Injections 299</option>
                <option value="IV">IV Injections 399</option>
                <option value="wound">Wound Dressing 399</option>
                <option value="Urine">Urine Pipe Change 799</option>
                <option value="Nurse">Nurse 24/7 2999</option>
              </select>
            </div>
          </div>

          <div className="field">
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="service"
                name="service"
              />
            </div>
          </div>

          <div className="field">
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="Message"
                name="Message"
              />
            </div>
          </div>

          <div className="field is-grouped">
            <div className="control">
              <button className="button is-primary" type="submit" id="submit-button">
                submit
              </button>
            </div>
          </div>
        </form>
        <div
          id="message"
          style={{
            display: 'none',
            margin: '20px',
            fontWeight: 'bold',
            color: 'green',
            padding: '8px',
            backgroundColor: 'beige',
            borderRadius: '4px',
            borderColor: 'aquamarine',
          }}
        ></div>
      </div>

      {/* WhatsApp Button */}
      <a href="https://wa.me/+918341069693" className="whatsapp-btn" target="_blank" rel="noopener noreferrer">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp Logo"
        />
        Chat Us Now
      </a>

      {/* Services Section */}
      <div className="chart-title" id="services">
        <h1>Our Services</h1>
        <p style={{ fontSize: '15px', color: '#666' }}>All These Services are at Your Home</p>
      </div>
      <section className="testimonials">
        <div className="testimonial">
          <img
            src="https://lh3.googleusercontent.com/Saib3HojfInq_W_swi4SgDtOCLxmGH4mI3kG5OK5bzuVAv2vvuTVI5vV_9coVqBsRZv4ziea_84pUmoC2A=s265-w265-h265"
            alt="Testimonial 1"
          />
          <p>
            Looking for professional, safe, and affordable injections service at home just Rs299 ? Our certified and experienced nurse injectors are here to provide high-quality care and deliver exceptional results. Whether you need iv or im other injectable treatments, our nurse-led services ensure you receive the best possible care.
          </p>
        </div>

        <div className="testimonial">
          <img
            src="https://lh3.googleusercontent.com/wNLkSKxk2Cmwl8Lx5vFWSPaawr6kZ1xH8CIp8I6sZePORd5cwGbRtp-T6ZPsmpidrQg8F9SAIOmHGdC0kA=s265-w265-h265"
            alt="Testimonial 2"
          />
          <p>
            Looking for expert wound dressing and surgical dressing services? Our team of licensed and skilled nurses specializes in the care and management of wounds, ensuring you receive top-quality, safe, and effective treatment. Whether recovering from surgery, managing chronic wounds, or needing post-procedural care, our nurse-led services are here to support your healing journey.
          </p>
        </div>

        <div className="testimonial">
          <img
            src="https://lh3.googleusercontent.com/lWxxfDMTHcRb4KNU0X1wpyh4EgTrtKs2BV1CXTACQM3fXu1Kz-YrNXuYNHcPK2pHp-6Soiqp9WFJu2BsjA=s265-w265-h265"
            alt="Testimonial 3"
          />
          <p>
            Looking for reliable, professional urine pipe change and catheterization services? Our team of certified and skilled nurses specializes in providing safe and efficient urinary catheterization and urine pipe change services. Whether you need temporary or long-term catheter care, we offer tailored solutions to ensure comfort, safety, and hygiene.
          </p>
        </div>

        <div className="testimonial">
          <img
            src="https://lh3.googleusercontent.com/nTa4Ms1E96zUzea9tvlanivCwyhnukUToxNrBV4GpEYNxml0AKAj6wNK1cbyfXE8O4lsTXPAGcBspU86gw=s265-w265-h265"
            alt="Testimonial 4"
          />
          <p>
            Looking for reliable IV infusion therapy and saline drips at the comfort of your home? Our home-based IV hydration service brings personalized treatment directly to your doorstep. Whether you need a boost in energy, hydration, or recovery after illness, we offer a range of IV infusion treatments, including saline hydration, vitamin C infusions, and electrolyte balance solutions tailored to your needs.
          </p>
        </div>

        <div className="testimonial">
          <img
            src="https://lh3.googleusercontent.com/_ij54-AorD3WxXzEZIG6xtXmG84j5yvRq5En_8ulYLzTd5Xsq_ZywmzEsronx9SPYkBNl8MQ3x9tc9I7hQ=s265-w265-h265"
            alt="Testimonial 5"
          />
          <p>
            Looking for professional IVF injection services at the comfort of your home? Our at-home IVF injection service offers a safe, convenient, and private option for patients undergoing in vitro fertilization (IVF) treatment. Whether you're starting your IVF journey or need ongoing injection support, our team of experienced nurses provides personalized, in-home care with the utmost precision and comfort.
          </p>
        </div>

        <div className="testimonial">
          <img
            src="https://lh3.googleusercontent.com/P1XTJjtK_XpUx8j5cL_GTWBPzX4bgI3gD7WnuVQ8llntPKzmpeUv_YJeKTEwSOnDUgFcPv2UtV8J80xrsA=s265-w265-h265"
            alt="Testimonial 6"
          />
          <p>
            IV Injection Service at your home, Our experienced Nurse come to your home and do medication there Get safe, reliable, and convenient IM (Intramuscular) and IV (Intravenous) injections at the comfort of your home. Our licensed nurses are available to administer injections for various health needs, including medication delivery, vitamin therapies, hydration treatments, and more. We ensure a professional, hygienic, and comfortable experience. Schedule your appointment today for personalized, in-home care!
          </p>
        </div>

        <div className="testimonial">
          <img
            src="https://lh3.googleusercontent.com/Ae6nfA51rnMfaWiuZw0lfwlxG_n8MUOViG7APoMD1eflCpFQ_9NWyTEe2GIyPYV62f1JJqVQl8EBprJHeQ=s265-w265-h265"
            alt="Testimonial 7"
          />
          <p>
            IM Injection Service at your home, Get safe, reliable, and convenient IM (Intramuscular) and IV (Intravenous) injections at the comfort of your home. Our licensed nurses are available to administer injections for various health needs, including medication delivery, vitamin therapies, hydration treatments, and more. We ensure a professional, hygienic, and comfortable experience. Schedule your appointment today for personalized, in-home care!
          </p>
        </div>

        <div className="testimonial">
          <img
            src="https://lh3.googleusercontent.com/xaKGRde8fPuAy5IPGKFLTLXjEFy4lkilQgjxlJXPxGQ0Dih594Ln4XnHwZLgqHfRO0yFTNOdnrV8k67Oaw=s265-w265-h265"
            alt="Testimonial 8"
          />
          <p>
            After surgery, receiving the right nursing care is essential to ensure a smooth and safe recovery. Our post-surgical nursing care services provide professional, compassionate care tailored to your unique needs. Our experienced nurses are trained to monitor your progress, manage post-operative symptoms, and assist with your recovery plan, so you can focus on healing.
            We offer a wide range of services designed to promote recovery, prevent complications, and improve your overall well-being after surgery. From wound care and pain management to medication administration and mobility assistance, our nurses are here to support you every step of the way.
          </p>
        </div>
      </section>

      {/* Org Chart / Team */}
      <div className="chart-title" id="team">
        <h1>Our Team</h1>
        <p style={{ fontSize: '15px', color: '#666' }}>Meet the key members of our organization</p>
      </div>

      <section className="org-chart">
        <div className="org-member">
          <img
            src="https://lh3.googleusercontent.com/NYx_F19A6LPXclmwfhhoIoxMuiR4qN4qS9eSTW_UXitdG9RZo2tlKPBLqTVsMG7yEpYbba-eLz4yrj8ZlQ=s265-w265-h265"
            alt="Team Member 1"
          />
          <p style={{ fontWeight: 'bold', color: '#333', fontSize: '16px' }}>Sunitha Yelamarthi</p>
          <p style={{ color: '#008080', fontWeight: 'bold' }}>CEO - Chief Executive Officer</p>
          <p>16+ Years Of Experience</p>
        </div>

        <div className="org-member">
          <img
            src="https://lh3.googleusercontent.com/WS5ec-h2gbrxkhYDVVykMtdj8Yd3Bxg6JnfkyP0WElnwlUTSCA97kiwS0CmwdAV9MNlmVoYzUpHYqGcFOA=s265-w265-h265"
            alt="Team Member 2"
          />
          <p style={{ fontWeight: 'bold', color: '#333', fontSize: '16px' }}>Mareswara Rao</p>
          <p style={{ color: '#008080', fontWeight: 'bold' }}>CTO - Chief Technology Officer</p>
          <p>Experienced</p>
        </div>

        <div className="org-member">
          <img
            src="https://lh3.googleusercontent.com/oDUKUl6NEyfOqOZuES2eGISF0S4YzSPVYZ9zgVjE_SeWam0Pf9DcUiCqzgcFWEQ7SXDE88RavHKOqiE1LQ=s265-w265-h265"
            alt="Team Member 3"
          />
          <p style={{ fontWeight: 'bold', color: '#333', fontSize: '16px' }}>Prabhakar Rao</p>
          <p style={{ color: '#008080', fontWeight: 'bold' }}>COO - Chief Operating Officer</p>
          <p>25+ Years Of Experience</p>
        </div>
      </section>

      {/* Footer Section */}
      <footer>
        <div className="footer-services">
          <h3>Services</h3>
          <ul>
            <li>Injections</li>
            <li>Vaccination</li>
            <li>Post-surgical care</li>
            <li>Wound dressing</li>
            <li>Urinary catheterization</li>
            <li>IV infusion and Injections</li>
          </ul>
        </div>

        <div className="footer-services">
          <h3>Why Us</h3>
          <ul>
            <li>Experienced Staff</li>
            <li>Refund policy</li>
            <li>Benifits</li>
            <li>Happy Customers</li>
          </ul>
        </div>

        <div className="footer-services">
          <h3>About Us</h3>
          <ul>
            <li>Vision</li>
            <li>Our Pillers</li>
            <li>Privacy Policy</li>
            <li>Terms and Conditions</li>
          </ul>
        </div>

        <div className="footer-services">
          <h3>Contact Us</h3>
          <ul>
            <li>maresh436@gmail.com</li>
            <li>Technical Officer</li>
            <li>Neetha Nursing</li>
            <li>Hyderabad</li>
          </ul>
        </div>

        <div className="footer-copy">
          <p>&copy; 2025 Neetha Nursing Service at home. All rights reserved.</p>
        </div>
      </footer>

      {/* Modal Dialog Box */}
      <div className="modal" id="loginModal">
        <div className="modal-content">
          <span className="close-btn" id="closeBtn">&times;</span>
          <h2 style={{ marginBottom: '15px', color: '#008080' }}>Login</h2>
          <form id="loginForm">
            <input type="text" id="username" placeholder="Username" required />
            <input type="password" id="password" placeholder="Password" required />
            <button type="submit">Submit</button>
          </form>
          <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
            <a
              href="https://n.neethanursing.in/admin/login"
              style={{ fontSize: '12px', color: '#008080', textDecoration: 'underline' }}
            >
              Go to Modern Admin Portal ➔
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
