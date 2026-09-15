/**
 * linuxkafe Customizer Preview
 * Live preview for Theme Customizer using postMessage transport
 * Vanilla JS, no jQuery dependency
 */

( function() {
  // Wait for wp.customize
  if ( ! window.wp || ! window.wp.customize ) {
    return;
  }

  const { customize } = wp;

  // Helper: safe querySelector
  function $( selector, context = document ) {
    return context.querySelector( selector );
  }

  // Helper: safe querySelectorAll
  function $$( selector, context = document ) {
    return Array.from( context.querySelectorAll( selector ) );
  }

  // Site title and description
  customize( 'blogname', ( value ) => {
    value.bind( ( to ) => {
      const el = $( '.site-title a' );
      if ( el ) el.textContent = to;
    } );
  } );

  customize( 'blogdescription', ( value ) => {
    value.bind( ( to ) => {
      const el = $( '.site-description' );
      if ( el ) el.textContent = to;
    } );
  } );

  // Header text color
  customize( 'header_textcolor', ( value ) => {
    value.bind( ( to ) => {
      const title = $( '.site-title' );
      const desc = $( '.site-description' );
      const link = $( '.site-title a' );

      if ( 'blank' === to ) {
        $$( '.site-title, .site-description' ).forEach( el => {
          el.style.clip = 'rect(1px, 1px, 1px, 1px)';
          el.style.position = 'absolute';
        } );
      } else {
        $$( '.site-title, .site-description' ).forEach( el => {
          el.style.clip = 'auto';
          el.style.position = 'relative';
        } );
        if ( link ) link.style.color = to;
        if ( desc ) desc.style.color = to;
      }
    } );
  } );

  /* ========================================================= */
  /* GAMIFICAÇÃO — Live Preview                                */
  /* ========================================================= */

  // Master toggle
  customize( 'linuxkafe_gamification_enabled', ( value ) => {
    value.bind( ( to ) => {
      const enabled = to === 'true' || to === true;
      toggleGamificationFeatures( enabled );
    } );
  } );

  // Individual feature toggles
  [ 'shell', 'tux', 'graffiti', 'cybercafe', 'easter_eggs' ].forEach( feature => {
    customize( `linuxkafe_gamification_${  feature}`, ( value ) => {
      value.bind( ( to ) => {
        const masterEnabled = customize( 'linuxkafe_gamification_enabled' )();
        const featureEnabled = to === 'true' || to === true;
        const finalEnabled = masterEnabled && featureEnabled;
        toggleFeature( feature, finalEnabled );
      } );
    } );
  } );

  // Listen for master toggle changes to update features
  customize( 'linuxkafe_gamification_enabled', ( value ) => {
    value.bind( ( to ) => {
      const masterEnabled = to === 'true' || to === true;
      [ 'shell', 'tux', 'graffiti', 'cybercafe', 'easter_eggs' ].forEach( feature => {
        const featureValue = customize( `linuxkafe_gamification_${  feature}` )();
        const featureEnabled = featureValue === 'true' || featureValue === true;
        toggleFeature( feature, masterEnabled && featureEnabled );
      } );
    } );
  } );

  /**
	 * Toggle all gamification features visibility
	 */
  function toggleGamificationFeatures( enabled ) {
    const trigger = document.querySelector( '[data-lk-shell-trigger]' );
    const tux = document.getElementById( 'lk-tux' );
    const graffiti = document.getElementById( 'lk-graffiti' );
    const toasts = document.getElementById( 'lk-toasts' );
    const killFeed = document.getElementById( 'lk-kill-feed' );

    [ trigger, tux, graffiti, toasts, killFeed ].forEach( el => {
      if ( el ) el.style.display = enabled ? '' : 'none';
    } );

    // If disabling, destroy instances to free memory
    if ( ! enabled && window.linuxkafeGamification ) {
      window.linuxkafeGamification.destroy?.();
    }
  }

  /**
	 * Toggle individual feature
	 */
  function toggleFeature( feature, enabled ) {
    let el = null;

    switch ( feature ) {
      case 'shell':
        el = document.querySelector( '[data-lk-shell-trigger]' );
        break;
      case 'tux':
        el = document.getElementById( 'lk-tux' );
        break;
      case 'graffiti':
        el = document.getElementById( 'lk-graffiti' );
        break;
      case 'cybercafe':
        el = document.getElementById( 'lk-toasts' );
        break;
      case 'easter_eggs':
        el = document.getElementById( 'lk-buy-menu' ) || document.getElementById( 'lk-kill-feed' );
        break;
    }

    if ( el ) {
      el.style.display = enabled ? '' : 'none';
    }
  }
} )();