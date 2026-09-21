/**
 * linuxkafe Header JS
 * Client area toggle, transparent header scroll effect
 * Vanilla JS, no dependencies
 */

( function() {
  'use strict';

  // Client Area Toggle (Header 1)
  function initClientArea() {
    const toggle = document.querySelector( '.client-area-toggle' );
    const form = document.getElementById( 'client-area-form' );

    if ( ! toggle || ! form ) {
      return;
    }

    function closeForm() {
      form.hidden = true;
      toggle.setAttribute( 'aria-expanded', 'false' );
      toggle.querySelector( '.toggle-text' ).textContent = toggle.dataset.openText || 'Open';
    }

    function openForm() {
      form.hidden = false;
      toggle.setAttribute( 'aria-expanded', 'true' );
      toggle.querySelector( '.toggle-text' ).textContent = toggle.dataset.closeText || 'Close';
    }

    toggle.addEventListener( 'click', () => {
      if ( form.hidden ) {
        openForm();
      } else {
        closeForm();
      }
    } );

    // Close button
    const closeBtn = form.querySelector( '.btn-close-client-area' );
    if ( closeBtn ) {
      closeBtn.addEventListener( 'click', closeForm );
    }

    // Close on outside click
    document.addEventListener( 'click', ( e ) => {
      if ( ! form.hidden && ! form.contains( e.target ) && ! toggle.contains( e.target ) ) {
        closeForm();
      }
    } );

    // Close on Escape
    document.addEventListener( 'keydown', ( e ) => {
      if ( e.key === 'Escape' && ! form.hidden ) {
        closeForm();
        toggle.focus();
      }
    } );

    // Store text for toggle
    toggle.dataset.openText = toggle.querySelector( '.toggle-text' ).textContent;
    toggle.dataset.closeText = closeBtn ? closeBtn.textContent : 'Close';
  }

  // Transparent Header Scroll Effect (Header 2)
  function initTransparentHeader() {
    const header = document.querySelector( '.header-style-2' );
    if ( ! header ) {
      return;
    }

    let lastScroll = 0;
    const threshold = 50;

    function handleScroll() {
      const currentScroll = window.pageYOffset;

      if ( currentScroll > threshold ) {
        header.classList.add( 'scrolled' );
      } else {
        header.classList.remove( 'scrolled' );
      }

      lastScroll = currentScroll;
    }

    window.addEventListener( 'scroll', handleScroll, { passive: true } );
  }

  // Initialize on DOM ready
  if ( document.readyState === 'loading' ) {
    document.addEventListener( 'DOMContentLoaded', () => {
      initClientArea();
      initTransparentHeader();
    } );
  } else {
    initClientArea();
    initTransparentHeader();
  }

  // Re-initialize for Customizer preview
  if ( window.wp && window.wp.customize ) {
    window.wp.customize.bind( 'preview-ready', () => {
      initClientArea();
      initTransparentHeader();
    } );
  }
} )();