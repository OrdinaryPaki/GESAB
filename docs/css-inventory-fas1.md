# CSS inventory (fas 1)

- `globals.css`: **2707** lines, **132** unique classes
- Method: class token search in `app/**/*.js` + definition search in other `app/**/*.css`
- Heuristic only — numbers are approximate. False positives exist (e.g. `.service-detail-section` matching `data-service-detail-section`, `.stars` matching `rating-stars`).
- **LIKELY-DEAD must be verified with exact class-token checks before any deletion in the final phase.**

## Status legend

| Status | Meaning |
|---|---|
| ACTIVE-GLOBAL-ONLY | Used in JS; defined only in globals |
| OVERRIDE | Used in JS; also redefined in module/responsive/other CSS |
| LIKELY-DEAD | Not found in JS; not redefined elsewhere |
| LIKELY-DEAD-OR-LEGACY | Not found in JS; still present in other CSS |
| MODIFIER | Short state/variant class — keep until contextual review |

## Counts

- **OVERRIDE**: 71
- **LIKELY-DEAD**: 27
- **ACTIVE-GLOBAL-ONLY**: 21
- **MODIFIER**: 13

## OVERRIDE (71)

### `.about-grid`

Used in:

- `app/components/HomeSections.js`

Also defined in:

- `app/home-fidelity.css`
- `app/responsive/home-mobile.css`
- `app/responsive/home.css`


### `.about-photo`

Used in:

- `app/components/HomeSections.js`

Also defined in:

- `app/home-fidelity.css`
- `app/responsive/home-mobile.css`


### `.about-row`

Used in:

- `app/components/HomeSections.js`

Also defined in:

- `app/home-fidelity.css`
- `app/responsive/home-mobile.css`
- `app/responsive/home.css`


### `.about-section`

Used in:

- `app/components/HomeSections.js`

Also defined in:

- `app/home-fidelity.css`
- `app/responsive/home-mobile.css`
- `app/responsive/home.css`


### `.appointment-card`

Used in:

- `app/components/GesabShell.js`
- `app/service/[slug]/ServiceQuoteForm.js`

Also defined in:

- `app/about/about.module.css`
- `app/contact/contact-page.module.css`
- `app/home-fidelity.css`
- `app/responsive/blog.css`
- `app/responsive/contact.css`
- `app/responsive/home-mobile.css`
- `app/responsive/mobile-pages-shared.css`
- `app/responsive/service.css`
- `app/responsive/shared.css`
- `app/service/[slug]/service-detail.module.css`
- `app/service/service-page.module.css`


### `.badge-grid`

Used in:

- `app/components/GesabShell.js`

Also defined in:

- `app/responsive/footer.css`


### `.check-list`

Used in:

- `app/components/HomeSections.js`

Also defined in:

- `app/home-fidelity.css`
- `app/responsive/home-mobile.css`


### `.contact-band`

Used in:

- `app/components/GesabShell.js`

Also defined in:

- `app/about/about.module.css`
- `app/contact/contact-page.module.css`
- `app/home-fidelity.css`
- `app/responsive/contact.css`
- `app/responsive/home-mobile.css`
- `app/responsive/mobile-pages-shared.css`
- `app/responsive/service.css`
- `app/responsive/shared.css`
- `app/service/service-page.module.css`


### `.contact-band-inner`

Used in:

- `app/components/GesabShell.js`

Also defined in:

- `app/about/about.module.css`
- `app/contact/contact-page.module.css`
- `app/home-fidelity.css`
- `app/responsive/blog.css`
- `app/responsive/contact.css`
- `app/responsive/home-mobile.css`
- `app/responsive/mobile-pages-shared.css`
- `app/responsive/service.css`
- `app/responsive/shared.css`
- `app/service/service-page.module.css`


### `.contact-card-row`

Used in:

- `app/contact/page.js`

Also defined in:

- `app/contact/contact-page.module.css`
- `app/responsive/contact-mobile.css`
- `app/responsive/contact.css`


### `.contact-copy`

Used in:

- `app/components/GesabShell.js`

Also defined in:

- `app/about/about.module.css`
- `app/contact/contact-page.module.css`
- `app/home-fidelity.css`
- `app/responsive/contact.css`
- `app/responsive/home-mobile.css`
- `app/responsive/mobile-pages-shared.css`
- `app/responsive/service.css`
- `app/responsive/shared.css`
- `app/service/service-page.module.css`


### `.contact-hero-inner`

Used in:

- `app/contact/page.js`

Also defined in:

- `app/contact/contact-page.module.css`
- `app/responsive/contact-mobile.css`
- `app/responsive/contact.css`


### `.contact-hero-section`

Used in:

- `app/contact/page.js`

Also defined in:

- `app/contact/contact-page.module.css`
- `app/responsive/contact-mobile.css`


### `.contact-info-section`

Used in:

- `app/contact/page.js`

Also defined in:

- `app/contact/contact-page.module.css`
- `app/responsive/contact-mobile.css`
- `app/responsive/contact.css`


### `.contact-main-form`

Used in:

- `app/contact/page.js`

Also defined in:

- `app/contact/contact-page.module.css`
- `app/responsive/contact-mobile.css`
- `app/responsive/contact.css`


### `.contact-methods`

Used in:

- `app/components/GesabShell.js`

Also defined in:

- `app/about/about.module.css`
- `app/responsive/home-mobile.css`
- `app/responsive/shared.css`


### `.container`

Used in:

- `app/about/about-sections.js`
- `app/about/process-concepts.js`
- `app/about/reveal-controller.js`
- `app/components/FaqSection.js`
- `app/components/FaqSectionAlternative.js`
- `app/components/GesabShell.js`
- `app/components/HomeSections.js`
- `app/contact/page.js`
- `app/faq-concepts/FaqConceptsShowcase.js`
- `app/service/[slug]/ServiceDetailPageView.js`

Also defined in:

- `app/about/about.module.css`
- `app/contact/contact-page.module.css`
- `app/home-fidelity.css`
- `app/responsive/about-mobile.css`
- `app/responsive/about.css`
- `app/responsive/contact-mobile.css`
- `app/responsive/contact.css`
- `app/responsive/footer.css`
- `app/responsive/home-mobile.css`
- `app/responsive/service.css`
- `app/responsive/shared.css`
- `app/service/[slug]/service-detail.module.css`


### `.cta-button`

Used in:

- `app/components/CtaButton.js`
- `app/faq-concepts/faq-concepts.js`

Also defined in:

- `app/contact/contact-page.module.css`
- `app/home-fidelity.css`
- `app/responsive/home-mobile.css`
- `app/responsive/mobile-navigation.css`
- `app/service/[slug]/service-detail.module.css`
- `app/service/service-page.module.css`


### `.dots`

Used in:

- `app/about/process-concepts.js`

Also defined in:

- `app/about/process-concepts.module.css`


### `.faq-cta`

Used in:

- `app/components/FaqSection.js`
- `app/components/FaqSectionAlternative.js`

Also defined in:

- `app/about/about.module.css`
- `app/contact/contact-page.module.css`
- `app/home-fidelity.css`
- `app/responsive/about-mobile.css`
- `app/responsive/contact-mobile.css`
- `app/responsive/home-mobile.css`


### `.faq-grid`

Used in:

- `app/components/FaqSection.js`

Also defined in:

- `app/about/about.module.css`
- `app/contact/contact-page.module.css`
- `app/home-fidelity.css`
- `app/responsive/about-mobile.css`
- `app/responsive/about.css`
- `app/responsive/contact-mobile.css`
- `app/responsive/contact.css`
- `app/responsive/home-mobile.css`
- `app/responsive/home.css`
- `app/responsive/shared.css`


### `.faq-item`

Used in:

- `app/components/FaqAccordion.js`

Also defined in:

- `app/about/about.module.css`
- `app/contact/contact-page.module.css`
- `app/faq-alt.css`
- `app/responsive/about-mobile.css`
- `app/responsive/contact-mobile.css`
- `app/responsive/home-mobile.css`
- `app/service/[slug]/service-detail.module.css`


### `.faq-list`

Used in:

- `app/components/FaqAccordion.js`

Also defined in:

- `app/faq-alt.css`
- `app/responsive/about-mobile.css`
- `app/responsive/contact-mobile.css`
- `app/responsive/home-mobile.css`
- `app/service/[slug]/service-detail.module.css`


### `.faq-panel`

Used in:

- `app/components/FaqAccordion.js`

Also defined in:

- `app/about/about.module.css`
- `app/contact/contact-page.module.css`


### `.faq-question`

Used in:

- `app/components/FaqAccordion.js`

Also defined in:

- `app/about/about.module.css`
- `app/contact/contact-page.module.css`
- `app/faq-alt.css`
- `app/service/[slug]/service-detail.module.css`


### `.faq-section`

Used in:

- `app/about/reveal-controller.js`
- `app/components/FaqSection.js`
- `app/components/FaqSectionAlternative.js`

Also defined in:

- `app/about/about.module.css`
- `app/contact/contact-page.module.css`
- `app/home-fidelity.css`
- `app/responsive/about-mobile.css`
- `app/responsive/about.css`
- `app/responsive/contact-mobile.css`
- `app/responsive/home-mobile.css`


### `.faq-toggle`

Used in:

- `app/components/FaqAccordion.js`

Also defined in:

- `app/about/about.module.css`
- `app/contact/contact-page.module.css`
- `app/faq-alt.css`


### `.footer`

Used in:

- `app/components/GesabShell.js`

Also defined in:

- `app/responsive/footer.css`


### `.footer-bottom`

Used in:

- `app/components/GesabShell.js`

Also defined in:

- `app/responsive/footer.css`


### `.footer-brand`

Used in:

- `app/components/GesabShell.js`

Also defined in:

- `app/responsive/footer.css`


### `.footer-grid`

Used in:

- `app/components/GesabShell.js`

Also defined in:

- `app/responsive/footer.css`


### `.footer-list`

Used in:

- `app/components/GesabShell.js`

Also defined in:

- `app/responsive/footer.css`


### `.gallery-grid`

Used in:

- `app/components/HomeSections.js`

Also defined in:

- `app/home-fidelity.css`
- `app/responsive/home-mobile.css`


### `.gallery-section`

Used in:

- `app/components/HomeSections.js`

Also defined in:

- `app/home-fidelity.css`
- `app/responsive/home-mobile.css`


### `.header-inner`

Used in:

- `app/components/GesabShell.js`

Also defined in:

- `app/responsive/mobile-navigation.css`


### `.hero`

Used in:

- `app/components/GesabShell.js`
- `app/components/HomeReveal.js`
- `app/components/HomeSections.js`
- `app/contact/page.js`
- `app/service/[slug]/ServiceDetailPageView.js`

Also defined in:

- `app/home-fidelity.css`
- `app/responsive/home-mobile.css`
- `app/responsive/home.css`
- `app/service/[slug]/service-detail.module.css`


### `.hero-content`

Used in:

- `app/components/HomeSections.js`

Also defined in:

- `app/home-fidelity.css`
- `app/responsive/home-mobile.css`
- `app/responsive/home.css`


### `.hero-pattern`

Used in:

- `app/components/HomeSections.js`

Also defined in:

- `app/home-fidelity.css`
- `app/responsive/home-mobile.css`


### `.hero-photo`

Used in:

- `app/components/HomeSections.js`

Also defined in:

- `app/home-fidelity.css`
- `app/responsive/home-mobile.css`


### `.image-stack`

Used in:

- `app/components/HomeSections.js`

Also defined in:

- `app/home-fidelity.css`


### `.logo`

Used in:

- `app/components/GesabIcons.js`
- `app/components/GesabShell.js`

Also defined in:

- `app/responsive/mobile-navigation.css`


### `.logo-link`

Used in:

- `app/components/GesabShell.js`

Also defined in:

- `app/responsive/mobile-navigation.css`


### `.logo-text`

Used in:

- `app/components/GesabIcons.js`

Also defined in:

- `app/responsive/mobile-navigation.css`


### `.metric-card`

Used in:

- `app/components/HomeSections.js`

Also defined in:

- `app/home-fidelity.css`
- `app/responsive/home-mobile.css`


### `.mobile-menu`

Used in:

- `app/components/GesabShell.js`
- `app/components/MobileNavigationEnhancement.js`

Also defined in:

- `app/responsive/mobile-navigation.css`


### `.mobile-menu-button`

Used in:

- `app/components/GesabShell.js`
- `app/components/MobileNavigationEnhancement.js`

Also defined in:

- `app/responsive/mobile-navigation.css`


### `.mobile-menu-panel`

Used in:

- `app/components/GesabShell.js`
- `app/components/MobileNavigationEnhancement.js`

Also defined in:

- `app/responsive/mobile-navigation.css`


### `.mobile-phone-link`

Used in:

- `app/components/GesabShell.js`

Also defined in:

- `app/responsive/mobile-navigation.css`


### `.rating-line`

Used in:

- `app/components/HomeSections.js`

Also defined in:

- `app/home-fidelity.css`
- `app/responsive/home-mobile.css`


### `.rating-pill`

Used in:

- `app/components/HomeSections.js`

Also defined in:

- `app/home-fidelity.css`


### `.rating-stars`

Used in:

- `app/components/HomeSections.js`

Also defined in:

- `app/about/about.module.css`


### `.section-title`

Used in:

- `app/about/process-concepts.js`
- `app/components/FaqSection.js`
- `app/components/HomeSections.js`
- `app/contact/page.js`

Also defined in:

- `app/about/about.module.css`
- `app/contact/contact-page.module.css`
- `app/home-fidelity.css`
- `app/responsive/about.css`
- `app/responsive/contact-mobile.css`


### `.service-card`

Used in:

- `app/components/HomeSections.js`

Also defined in:

- `app/home-fidelity.css`
- `app/responsive/home-mobile.css`
- `app/responsive/home.css`


### `.service-detail-page`

Used in:

- `app/service/[slug]/ServiceDetailPageView.js`

Also defined in:

- `app/responsive/mobile-pages-shared.css`
- `app/responsive/service-mobile.css`
- `app/responsive/shared.css`


### `.service-select-field`

Used in:

- `app/components/ServiceSelect.js`

Also defined in:

- `app/contact/contact-page.module.css`
- `app/service/[slug]/service-detail.module.css`


### `.service-select-trigger`

Used in:

- `app/components/ServiceSelect.js`

Also defined in:

- `app/contact/contact-page.module.css`
- `app/service/[slug]/service-detail.module.css`


### `.services-grid`

Used in:

- `app/components/HomeSections.js`

Also defined in:

- `app/home-fidelity.css`
- `app/responsive/home-mobile.css`
- `app/responsive/home.css`


### `.services-section`

Used in:

- `app/components/HomeSections.js`

Also defined in:

- `app/home-fidelity.css`
- `app/responsive/home-mobile.css`


### `.site-header`

Used in:

- `app/components/GesabShell.js`
- `app/nav-showcase/page.js`

Also defined in:

- `app/responsive/mobile-navigation.css`


### `.split-title`

Used in:

- `app/components/HomeSections.js`

Also defined in:

- `app/home-fidelity.css`
- `app/responsive/home-mobile.css`


### `.stat-grid`

Used in:

- `app/components/HomeSections.js`

Also defined in:

- `app/home-fidelity.css`
- `app/responsive/home-mobile.css`
- `app/responsive/home.css`


### `.support-grid`

Used in:

- `app/components/HomeSections.js`

Also defined in:

- `app/home-fidelity.css`
- `app/responsive/home-mobile.css`


### `.support-item`

Used in:

- `app/components/HomeSections.js`

Also defined in:

- `app/home-fidelity.css`
- `app/responsive/home-mobile.css`


### `.support-strip`

Used in:

- `app/components/HomeSections.js`

Also defined in:

- `app/home-fidelity.css`
- `app/responsive/home-mobile.css`


### `.testimonial-card`

Used in:

- `app/components/HomeSections.js`

Also defined in:

- `app/about/about.module.css`
- `app/home-fidelity.css`
- `app/responsive/about-mobile.css`
- `app/responsive/about.css`
- `app/responsive/home-mobile.css`


### `.testimonial-grid`

Used in:

- `app/components/HomeSections.js`

Also defined in:

- `app/about/about.module.css`
- `app/home-fidelity.css`
- `app/responsive/about-mobile.css`
- `app/responsive/home-mobile.css`


### `.testimonial-section`

Used in:

- `app/about/reveal-controller.js`
- `app/components/HomeSections.js`

Also defined in:

- `app/about/about.module.css`
- `app/home-fidelity.css`
- `app/responsive/about-mobile.css`
- `app/responsive/about.css`
- `app/responsive/home-mobile.css`


### `.trusted`

Used in:

- `app/components/HomeSections.js`

Also defined in:

- `app/home-fidelity.css`
- `app/responsive/home-mobile.css`


### `.why-copy`

Used in:

- `app/components/HomeSections.js`

Also defined in:

- `app/responsive/home-mobile.css`


### `.why-grid`

Used in:

- `app/components/HomeSections.js`

Also defined in:

- `app/home-fidelity.css`
- `app/responsive/home-mobile.css`


### `.why-section`

Used in:

- `app/components/HomeSections.js`

Also defined in:

- `app/home-fidelity.css`
- `app/responsive/home-mobile.css`


## ACTIVE-GLOBAL-ONLY (21)

### `.about-story-section`

Used in:

- `app/about/about-sections.js`


### `.blue-icon`

Used in:

- `app/components/HomeSections.js`


### `.contact-band-bg`

Used in:

- `app/components/GesabShell.js`


### `.contact-band-overlay`

Used in:

- `app/components/GesabShell.js`


### `.cta-button-yellow`

Used in:

- `app/faq-concepts/faq-concepts.js`


### `.faq-intro`

Used in:

- `app/components/FaqSection.js`


### `.faq-panel-inner`

Used in:

- `app/components/FaqAccordion.js`


### `.faq-question-text`

Used in:

- `app/components/FaqAccordion.js`


### `.header-left`

Used in:

- `app/components/GesabShell.js`


### `.header-right`

Used in:

- `app/components/GesabShell.js`


### `.nav-links`

Used in:

- `app/components/GesabShell.js`


### `.phone-button`

Used in:

- `app/components/GesabShell.js`


### `.service-detail-section`

Used in:

- `app/service/[slug]/ServiceDetailPageView.js`


### `.service-select`

Used in:

- `app/components/ServiceSelect.js`


### `.service-select-check`

Used in:

- `app/components/ServiceSelect.js`


### `.service-select-chevron`

Used in:

- `app/components/ServiceSelect.js`


### `.service-select-menu`

Used in:

- `app/components/ServiceSelect.js`


### `.service-select-option`

Used in:

- `app/components/ServiceSelect.js`


### `.service-select-value`

Used in:

- `app/components/ServiceSelect.js`


### `.socials`

Used in:

- `app/components/GesabShell.js`


### `.stars`

Used in:

- `app/components/HomeSections.js`


## LIKELY-DEAD (27)

### `.about-collage`


### `.about-story-grid`


### `.contact-page-grid`


### `.contact-page-section`


### `.contact-tile-grid`


### `.cta-button-blue`


### `.cta-button-dark`


### `.detail-article`


### `.detail-article-section`


### `.detail-checks`


### `.detail-grid`


### `.detail-hero-section`


### `.detail-main`


### `.logo-mark`


### `.mission-card-row`


### `.mission-section`


### `.note-icon`


### `.review-grid`


### `.service-detail-layout`


### `.service-index-cta`


### `.service-index-section`


### `.service-index-title`


### `.service-review-section`


### `.service-sidebar`


### `.service-trust-grid`


### `.service-trust-section`


### `.trust-list`


## LIKELY-DEAD-OR-LEGACY (0)

## MODIFIER (13)

### `.active`

Used in:

- `app/components/ServiceSelect.js`
- `app/faq-concepts/FaqConceptsShowcase.js`


### `.center`

Used in:

- `app/about/process-concepts.js`
- `app/components/HomeSections.js`
- `app/contact/page.js`
- `app/nav-showcase/page.js`

Also defined in:

- `app/nav-showcase/showcase.module.css`


### `.compact`

Used in:

- `app/blog/BlogIndexGrid.js`
- `app/components/HomeSections.js`


### `.dark`

Used in:

- `app/about/page.js`
- `app/blog/layout.js`
- `app/components/GesabIcons.js`
- `app/components/GesabShell.js`
- `app/components/HomeSections.js`
- `app/contact/page.js`
- `app/nav-showcase/page.js`
- `app/service/[slug]/ServiceDetailPageView.js`
- `app/service/page.js`

Also defined in:

- `app/responsive/mobile-navigation.css`


### `.light`

Used in:

- `app/components/HomeSections.js`


### `.narrow`


### `.open`

Used in:

- `app/components/FaqAccordion.js`
- `app/components/MobileNavigationEnhancement.js`
- `app/components/ServiceSelect.js`
- `app/faq-concepts/faq-concepts.js`

Also defined in:

- `app/about/about.module.css`
- `app/contact/contact-page.module.css`
- `app/faq-alt.css`
- `app/responsive/contact-mobile.css`
- `app/responsive/home-mobile.css`


### `.person`

Used in:

- `app/components/HomeSections.js`

Also defined in:

- `app/about/about.module.css`


### `.placeholder`

Used in:

- `app/about/about-sections.js`
- `app/components/GesabShell.js`
- `app/components/ServiceSelect.js`
- `app/components/home-image-data.js`
- `app/components/placeholder-images.js`
- `app/contact/page.js`
- `app/service/[slug]/ServiceQuoteForm.js`


### `.selected`

Used in:

- `app/about/process-concepts.js`
- `app/components/ServiceSelect.js`
- `app/nav-showcase/page.js`


### `.small`

Used in:

- `app/components/HomeSections.js`


### `.white`

Used in:

- `app/faq-concepts/faq-concepts.js`


### `.wide`

Used in:

- `app/components/HomeSections.js`
- `app/contact/page.js`

Also defined in:

- `app/contact/contact-page.module.css`
- `app/home-fidelity.css`
- `app/responsive/contact.css`


## Cascade stacks (key examples)

### `.contact-main-form`

1. `app/globals.css:1684`
2. `app/contact/contact-page.module.css:69`
3. `app/responsive/contact-mobile.css:18`
4. `app/responsive/contact.css:24`

### `.appointment-card`

1. `app/globals.css:1439`
2. `app/about/about.module.css:614`
3. `app/contact/contact-page.module.css:313`
4. `app/home-fidelity.css:106`
5. `app/responsive/blog.css:27`
6. `app/responsive/contact.css:7`
7. `app/responsive/home-mobile.css:241`
8. `app/responsive/mobile-pages-shared.css:89`
9. `app/responsive/service.css:52`
10. `app/responsive/shared.css:44`
11. `app/service/[slug]/service-detail.module.css:319`
12. `app/service/service-page.module.css:351`

### `.faq-item`

1. `app/globals.css:1258`
2. `app/about/about.module.css:263`
3. `app/contact/contact-page.module.css:250`
4. `app/faq-alt.css:69`
5. `app/responsive/about-mobile.css:150`
6. `app/responsive/contact-mobile.css:73`
7. `app/responsive/home-mobile.css:205`
8. `app/service/[slug]/service-detail.module.css:294`

### `.contact-band`

1. `app/globals.css:1359`
2. `app/about/about.module.css:589`
3. `app/contact/contact-page.module.css:457`
4. `app/home-fidelity.css:408`
5. `app/responsive/contact.css:44`
6. `app/responsive/home-mobile.css:218`
7. `app/responsive/mobile-pages-shared.css:21`
8. `app/responsive/service.css:61`
9. `app/responsive/shared.css:56`
10. `app/service/service-page.module.css:160`

### `.cta-button`

1. `app/globals.css:369`
2. `app/contact/contact-page.module.css:131`
3. `app/home-fidelity.css:42`
4. `app/responsive/home-mobile.css:51`
5. `app/responsive/mobile-navigation.css:139`
6. `app/service/[slug]/service-detail.module.css:365`
7. `app/service/service-page.module.css:373`

### `.service-card`

1. `app/globals.css:821`
2. `app/home-fidelity.css:299`
3. `app/responsive/home-mobile.css:123`
4. `app/responsive/home.css:18`

### `.section-title`

1. `app/globals.css:707`
2. `app/about/about.module.css:467`
3. `app/contact/contact-page.module.css:150`
4. `app/home-fidelity.css:99`
5. `app/responsive/about.css:185`
6. `app/responsive/contact-mobile.css:38`

### `.hero`

1. `app/globals.css:490`
2. `app/home-fidelity.css:3`
3. `app/responsive/home-mobile.css:17`
4. `app/responsive/home.css:46`
5. `app/service/[slug]/service-detail.module.css:13`

### `.service-select-trigger`

1. `app/globals.css:66`
2. `app/contact/contact-page.module.css:99`
3. `app/service/[slug]/service-detail.module.css:355`

## Double imports (verified)

These five files are imported by both `app/layout.js` and `app/responsive.css`:

- `responsive/mobile-pages-shared.css`
- `responsive/about-mobile.css`
- `responsive/contact-mobile.css`
- `responsive/service-mobile.css`
- `responsive/blog-mobile.css`

## Fragile responsive selectors

- `app/responsive/about-mobile.css`: 20 `[class*=...]`
- `app/responsive/about.css`: 51 `[class*=...]`
- `app/responsive/blog-mobile.css`: 51 `[class*=...]`
- `app/responsive/blog.css`: 76 `[class*=...]`
- `app/responsive/contact-mobile.css`: 35 `[class*=...]`
- `app/responsive/contact.css`: 20 `[class*=...]`
- `app/responsive/mobile-pages-shared.css`: 40 `[class*=...]`
- `app/responsive/service-mobile.css`: 81 `[class*=...]`
- `app/responsive/service.css`: 120 `[class*=...]`
- `app/responsive/shared.css`: 15 `[class*=...]`

**Total** in responsive tree: 509

## Recommended order (locked)

1. Inventory (this doc) + remove verified double imports in `layout.js`
2. Extract shared component styles (header/footer/contact-band, CTA, FAQ, ServiceSelect)
3. Move each page's desktop + mobile rules into the same page module
4. Remove dead legacy CSS from globals only after ownership is clear
5. Leave tokens, reset, base typography, true globals in `globals.css`

**Do not** mass-delete overlapping rules from globals while cascade layers still depend on order.

## Fas 1 actions taken

- [x] Inventory written (this doc)
- [x] Removed verified double imports from `app/layout.js` (5 mobile CSS files remain only via `responsive.css`)
- [x] No mass deletions from `globals.css` during inventory

## Fas 3 progress (shared component style owners)

Internal order: ServiceSelect → FAQ → CTA → header/footer → ContactBand/AppointmentForm

- [x] **ServiceSelect** — base + `prefers-reduced-motion` moved to `app/components/ServiceSelect.css` (imported by the component). Context overrides under `.appointment-card` / contact / service-detail left with those hosts until their step.
- [x] **FAQ** — split owners on purpose:
  - `FaqAccordion.css` = shared accordion primitive
  - `FaqSection.css` = section shell (home/about/contact)
  - HOME rhythm stays under `.home-page` in `home-fidelity.css` / `home-mobile.css`
  - Service detail keeps its own accordion look via `service-detail.module.css` (does not use `FaqSection`)
- [ ] CTA
- [ ] Header / footer
- [ ] ContactBand / AppointmentForm

### Contact form cascade (verified example)

1. `app/globals.css` — `.contact-main-form` base (grid, soft bg)
2. `app/contact/contact-page.module.css` — `.page :global(.contact-main-form)` override (flex, fixed width)
3. `app/responsive/contact.css` + `contact-mobile.css` — further responsive overrides via `[class*="contact-page-module"]`

Removing the globals layer early would change the cascade for any property the module does not fully re-specify.

### Note on LIKELY-DEAD

These class names are not referenced from `app/**/*.js` (pages now use CSS modules). Treat as **candidates for phase 4**, not safe deletes today — some may still be hit by nested selectors or shared markup strings outside the heuristic.
