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

  /* ========================================================= */
  /* LAYOUT SYSTEM — Live Preview (T006)                       */
  /* ========================================================= */

  customize( 'linuxkafe_layout_type', ( value ) => {
    value.bind( ( to ) => {
      applyLayoutClass( to );
    } );
  } );

  /**
   * Apply layout class to body for live preview
   */
  function applyLayoutClass( layout ) {
    const validLayouts = [ 'wide', 'semiboxed', 'boxed', 'boxed-margin' ];
    const safeLayout = validLayouts.includes( layout ) ? layout : 'semiboxed';

    // Remove existing layout classes
    document.body.classList.remove( 'layout-wide', 'layout-semiboxed', 'layout-boxed', 'layout-boxed-margin' );

    // Add new layout class
    document.body.classList.add( `layout-${  safeLayout }` );

    // Trigger reflow for container elements
    const containers = document.querySelectorAll( '.site-header, .header-container, .linuxkafe-modern-theme, .site-main, .site-footer, .menu-wrapper' );
    containers.forEach( el => {
      // Force style recalculation
      el.style.maxWidth = '';
      el.style.marginLeft = '';
      el.style.marginRight = '';
      el.style.backgroundColor = '';
      el.style.boxShadow = '';
      el.style.borderRadius = '';
      el.style.overflow = '';
    } );
  }

  /* ========================================================= */
  /* HEADER STYLES — Live Preview (T007)                       */
  /* ========================================================= */

  customize( 'linuxkafe_header_style', ( value ) => {
    value.bind( ( to ) => {
      applyHeaderStyle( to );
    } );
  } );

  /**
   * Apply header style class to body for live preview
   */
  function applyHeaderStyle( style ) {
    const validStyles = [ 'header_1', 'header_2', 'header_3' ];
    const safeStyle = validStyles.includes( style ) ? style : 'header_1';

    // Remove existing header style classes
    document.body.classList.remove( 'header-style-1', 'header-style-2', 'header-style-3' );

    // Add new header style class
    document.body.classList.add( `header-style-${  safeStyle.replace( 'header_', '' ) }` );

    // Reload header via AJAX for preview (simplified: just reload page)
    // In a real implementation, this would fetch the header template part
    if ( window.wp && window.wp.customize ) {
      window.wp.customize.previewer.refresh();
    }
  }

  // Client Area fields live preview
  [ 'show_support', 'login_user', 'login_password', 'login_button', 'close_title', 'open_title' ].forEach( field => {
    customize( `linuxkafe_header_${  field}`, ( value ) => {
      value.bind( () => {
        if ( window.wp && window.wp.customize ) {
          window.wp.customize.previewer.refresh();
        }
      } );
    } );
  } );

  // Top Bar fields live preview
  [ 'topbar_show_elements', 'topbar_align' ].forEach( field => {
    customize( `linuxkafe_${  field}`, ( value ) => {
      value.bind( () => {
        if ( window.wp && window.wp.customize ) {
          window.wp.customize.previewer.refresh();
        }
      } );
    } );
  } );

  [ 1, 2, 3 ].forEach( num => {
    [ 'icon', 'title', 'url' ].forEach( field => {
      customize( `linuxkafe_topbar_element_${  num }_${  field }`, ( value ) => {
        value.bind( () => {
          if ( window.wp && window.wp.customize ) {
            window.wp.customize.previewer.refresh();
          }
        } );
      } );
    } );
  } );

  // Section Titles live preview
  [ 'section_title_align', 'section_title_breadcrumbs' ].forEach( field => {
    customize( `linuxkafe_${  field }`, ( value ) => {
      value.bind( () => {
        if ( window.wp && window.wp.customize ) {
          window.wp.customize.previewer.refresh();
        }
      } );
    } );
  } );
} )();