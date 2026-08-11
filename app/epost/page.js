"use client";

import { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { image, contactInfo } from "../gesab-data";
import styles from "./epost.module.css";

export default function EpostPreviewPage() {
  const [theme, setTheme] = useState("light");
  const [viewport, setViewport] = useState("desktop");
  const [recipient, setRecipient] = useState("customer");
  const [source, setSource] = useState("contact");

  return (
    <div className={styles.page}>
      <Header dark />
      <main className={styles.main}>
        <div className={styles.controls}>
          <h2>E-post Förhandsgranskning</h2>
          
          <div className={styles.toggles}>
            <div className={styles.toggleGroup}>
              <label>Tema:</label>
              <div className={styles.toggleButtons}>
                <button 
                  className={theme === 'light' ? styles.active : ''} 
                  onClick={() => setTheme('light')}
                >
                  Ljust
                </button>
                <button 
                  className={theme === 'dark' ? styles.active : ''} 
                  onClick={() => setTheme('dark')}
                >
                  Mörkt
                </button>
              </div>
            </div>

            <div className={styles.toggleGroup}>
              <label>Enhet:</label>
              <div className={styles.toggleButtons}>
                <button 
                  className={viewport === 'desktop' ? styles.active : ''} 
                  onClick={() => setViewport('desktop')}
                >
                  Desktop
                </button>
                <button 
                  className={viewport === 'mobile' ? styles.active : ''} 
                  onClick={() => setViewport('mobile')}
                >
                  Mobil
                </button>
              </div>
            </div>

            <div className={styles.toggleGroup}>
              <label>Mottagare:</label>
              <div className={styles.toggleButtons}>
                <button 
                  className={recipient === 'customer' ? styles.active : ''} 
                  onClick={() => setRecipient('customer')}
                >
                  Till Kund
                </button>
                <button 
                  className={recipient === 'internal' ? styles.active : ''} 
                  onClick={() => setRecipient('internal')}
                >
                  Till Oss (Internt)
                </button>
              </div>
            </div>

            <div className={styles.toggleGroup}>
              <label>Källa (Formulär):</label>
              <div className={styles.toggleButtons}>
                <button 
                  className={source === 'contact' ? styles.active : ''} 
                  onClick={() => setSource('contact')}
                >
                  Kontaktsidan
                </button>
                <button 
                  className={source === 'service' ? styles.active : ''} 
                  onClick={() => setSource('service')}
                >
                  Tjänster
                </button>
                <button 
                  className={source === 'footer' ? styles.active : ''} 
                  onClick={() => setSource('footer')}
                >
                  Footer / Boka
                </button>
                <button 
                  className={source === 'blog' ? styles.active : ''} 
                  onClick={() => setSource('blog')}
                >
                  Blogg
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.previewContainer}>
          <div className={`${styles.previewWrapper} ${styles[viewport]}`}>
            <EmailTemplate theme={theme} recipient={recipient} source={source} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function EmailTemplate({ theme, recipient, source }) {
  const isDark = theme === "dark";
  
  let subjectLine = "";
  let fromLine = "";
  let toLine = "";

  if (recipient === "customer") {
    if (source === "contact") subjectLine = "Tack för din förfrågan gällande Badrumsrenovering - GESAB";
    else if (source === "service") subjectLine = "Tack för din offertförfrågan gällande Badrumsrenovering - GESAB";
    else if (source === "blog") subjectLine = "Tack för ditt meddelande - GESAB";
    else subjectLine = "Tack för din förfrågan - GESAB";
    
    fromLine = "GESAB <info@gesab.se>";
    toLine = "Anna Andersson <anna.andersson@example.com>";
  } else {
    // Lägg till kundens namn i ämnesraden för att undvika att mejlklienter grupperar ihop olika förfrågningar i samma tråd
    const customerName = "Anna Andersson";
    const dateStr = new Date().toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' });
    
    if (source === "contact") subjectLine = `Ny förfrågan: Badrumsrenovering – ${customerName} (${dateStr})`;
    if (source === "service") subjectLine = `Offertförfrågan: Badrumsrenovering – ${customerName} (${dateStr})`;
    if (source === "footer") subjectLine = `Boka offert via hemsidan – ${customerName} (${dateStr})`;
    if (source === "blog") subjectLine = `Förfrågan via bloggen – ${customerName} (${dateStr})`;
    
    fromLine = "GESAB Hemsida <noreply@gesab.se>";
    toLine = "GESAB <info@gesab.se>";
  }

  return (
    <div className={`${styles.macWindow} ${isDark ? styles.dark : ''}`}>
      {/* Mac Window Titlebar */}
      <div className={styles.macTitlebar}>
        <div className={styles.macControls}>
          <div className={`${styles.macControl} ${styles.macClose}`}></div>
          <div className={`${styles.macControl} ${styles.macMinimize}`}></div>
          <div className={`${styles.macControl} ${styles.macMaximize}`}></div>
        </div>
      </div>

      {/* Email Headers (From, To, Subject) */}
      <div className={styles.emailHeaders}>
        <div className={styles.headerRow}>
          <span className={styles.headerLabel}>Från:</span>
          <span className={styles.headerValue}>{fromLine}</span>
        </div>
        <div className={styles.headerRow}>
          <span className={styles.headerLabel}>Till:</span>
          <span className={styles.headerValue}>{toLine}</span>
        </div>
        <div className={`${styles.headerRow} ${styles.headerSubject}`}>
          <span className={styles.headerLabel}>Ämne:</span>
          <span className={styles.headerValue}>{subjectLine}</span>
        </div>
      </div>

      {/* Email Body */}
      <div className={styles.emailBody}>
        <div className={styles.emailInner}>
          {recipient === "customer" ? (
            <CustomerEmail source={source} />
          ) : (
            <InternalEmail source={source} />
          )}
        </div>
      </div>
    </div>
  );
}

function CustomerEmail({ source }) {
  return (
    <>
      <div className={styles.emailLogo}>GESAB</div>
      <h2 className={styles.greeting}>
        {source === 'blog' ? 'Tack för ditt meddelande!' : 'Tack för din förfrågan!'}
      </h2>
      <p>Hej Anna,</p>
      <p>
        Vi har tagit emot din förfrågan
        {(source === 'contact' || source === 'service') && <span> gällande <strong>Badrumsrenovering</strong></span>}. 
        Vi uppskattar att du vänder dig till oss på GESAB för ditt kommande projekt.
      </p>
      <p>
        Vårt team kommer nu att gå igenom dina uppgifter. Vi återkommer till dig inom kort för att diskutera nästa steg, svara på eventuella frågor och boka in en kostnadsfri genomgång på plats.
      </p>
      
      <div className={styles.actionBox}>
        <p>Har du frågor redan nu? Tveka inte att höra av dig.</p>
        <a href={contactInfo.phonePrimaryHref} className={styles.buttonPrimary}>
          Ring oss: {contactInfo.phonePrimary}
        </a>
      </div>

      <div className={styles.emailFooterBranded}>
        <p><strong>{contactInfo.company}</strong></p>
        <p>{contactInfo.addressLine}</p>
        <p>
          <a href={contactInfo.emailHref}>{contactInfo.email}</a> | <a href={contactInfo.phonePrimaryHref}>{contactInfo.phonePrimary}</a>
        </p>
        <p><a href="https://gesab.se">www.gesab.se</a></p>
      </div>
    </>
  );
}

function InternalEmail({ source }) {
  return (
    <>
      <div className={styles.internalBadge}>INTERNT</div>
      <h2 className={styles.greeting}>
        {source === 'contact' && "Ny Förfrågan: Badrumsrenovering"}
        {source === 'service' && "Ny Offertförfrågan: Badrumsrenovering"}
        {source === 'footer' && "Ny Boka Offert-förfrågan"}
        {source === 'blog' && "Ny Förfrågan från Bloggen"}
      </h2>
      
      <div className={styles.summaryCard}>
        <p className={styles.summaryText}>
          En ny förfrågan har inkommit via <strong>{source === 'contact' ? 'Kontaktsidan' : source === 'service' ? 'Tjänstesidan' : source === 'blog' ? 'Bloggen' : 'Footer/Boka'}</strong>.
        </p>
      </div>
      
      <h3 className={styles.sectionTitle}>Kunduppgifter</h3>
      <table className={styles.dataTable}>
        <tbody>
          {source === 'contact' ? (
            <>
              <tr><th>Förnamn</th><td>Anna</td></tr>
              <tr><th>Efternamn</th><td>Andersson</td></tr>
              <tr><th>E-post</th><td><a href="mailto:anna.andersson@example.com">anna.andersson@example.com</a></td></tr>
              <tr><th>Tjänst</th><td><span className={styles.tag}>Badrumsrenovering</span></td></tr>
            </>
          ) : (
            <>
              <tr><th>Namn</th><td>Anna Andersson</td></tr>
              <tr><th>E-post</th><td><a href="mailto:anna.andersson@example.com">anna.andersson@example.com</a></td></tr>
              <tr><th>Telefon</th><td><a href="tel:0701234567">070-123 45 67</a></td></tr>
              {source === 'service' && (
                <tr><th>Tjänst</th><td><span className={styles.tag}>Badrumsrenovering</span></td></tr>
              )}
              {source === 'blog' && (
                <tr><th>Artikel</th><td><a href="#">5 tips för en lyckad badrumsrenovering</a></td></tr>
              )}
            </>
          )}
        </tbody>
      </table>

      <h3 className={styles.sectionTitle}>Meddelande</h3>
      <div className={styles.messageBox}>
        "Hej, vi planerar att renovera vårt badrum på ca 8 kvm och skulle vilja ha en offert. Vi vill gärna ha hjälp med både rivning och plattsättning."
      </div>
      
      <div className={styles.internalActions}>
        <a href="mailto:anna.andersson@example.com" className={styles.buttonPrimary}>Svara via E-post</a>
        {source !== 'contact' && (
          <a href="tel:0701234567" className={styles.buttonSecondary}>Ring Kund</a>
        )}
      </div>
    </>
  );
}
