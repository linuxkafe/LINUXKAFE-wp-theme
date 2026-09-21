<?php
/**
 * linuxkafe Theme Customizer
 *
 * @package linuxkafe
 */

/**
 * Add postMessage support for site title and description for the Theme Customizer.
 *
 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
 */
function linuxkafe_customize_register( $wp_customize ) {
	$wp_customize->get_setting( 'blogname' )->transport         = 'postMessage';
	$wp_customize->get_setting( 'blogdescription' )->transport  = 'postMessage';
	$wp_customize->get_setting( 'header_textcolor' )->transport = 'postMessage';

	if ( isset( $wp_customize->selective_refresh ) ) {
		$wp_customize->selective_refresh->add_partial(
			'blogname',
			array(
				'selector'        => '.site-title a',
				'render_callback' => 'linuxkafe_customize_partial_blogname',
			)
		);
		$wp_customize->selective_refresh->add_partial(
			'blogdescription',
			array(
				'selector'        => '.site-description',
				'render_callback' => 'linuxkafe_customize_partial_blogdescription',
			)
		);
	}

	/* ========================================================= */
	/* GAMIFICAÇÃO — Customizer Section (T002)                   */
	/* ========================================================= */

	// Section
	$wp_customize->add_section( 'linuxkafe_gamification', array(
		'title'       => __( 'Gamificação', 'linuxkafe' ),
		'description' => __( 'Controle os elementos interativos e easter eggs do tema.', 'linuxkafe' ),
		'priority'    => 35,
		'panel'       => '', // Top-level section
	) );

	// Master toggle
	$wp_customize->add_setting( 'linuxkafe_gamification_enabled', array(
		'default'           => true,
		'type'              => 'theme_mod',
		'sanitize_callback' => 'linuxkafe_sanitize_checkbox',
	) );
	$wp_customize->add_control( 'linuxkafe_gamification_enabled', array(
		'label'    => __( 'Ativar Gamificação', 'linuxkafe' ),
		'section'  => 'linuxkafe_gamification',
		'type'     => 'checkbox',
		'priority' => 10,
	) );

	// Shell toggle
	$wp_customize->add_setting( 'linuxkafe_gamification_shell', array(
		'default'           => true,
		'type'              => 'theme_mod',
		'sanitize_callback' => 'linuxkafe_sanitize_checkbox',
	) );
	$wp_customize->add_control( 'linuxkafe_gamification_shell', array(
		'label'    => __( 'Terminal Linux Interativo', 'linuxkafe' ),
		'section'  => 'linuxkafe_gamification',
		'type'     => 'checkbox',
		'priority' => 20,
	) );

	// Tux toggle
	$wp_customize->add_setting( 'linuxkafe_gamification_tux', array(
		'default'           => true,
		'type'              => 'theme_mod',
		'sanitize_callback' => 'linuxkafe_sanitize_checkbox',
	) );
	$wp_customize->add_control( 'linuxkafe_gamification_tux', array(
		'label'    => __( 'Tux Walker (Pinguim Animado)', 'linuxkafe' ),
		'section'  => 'linuxkafe_gamification',
		'type'     => 'checkbox',
		'priority' => 30,
	) );

	// Graffiti toggle
	$wp_customize->add_setting( 'linuxkafe_gamification_graffiti', array(
		'default'           => true,
		'type'              => 'theme_mod',
		'sanitize_callback' => 'linuxkafe_sanitize_checkbox',
	) );
	$wp_customize->add_control( 'linuxkafe_gamification_graffiti', array(
		'label'    => __( 'Graffiti Writer', 'linuxkafe' ),
		'section'  => 'linuxkafe_gamification',
		'type'     => 'checkbox',
		'priority' => 40,
	) );

	// Cybercafé toggle
	$wp_customize->add_setting( 'linuxkafe_gamification_cybercafe', array(
		'default'           => true,
		'type'              => 'theme_mod',
		'sanitize_callback' => 'linuxkafe_sanitize_checkbox',
	) );
	$wp_customize->add_control( 'linuxkafe_gamification_cybercafe', array(
		'label'    => __( 'Notificações Cybercafé', 'linuxkafe' ),
		'section'  => 'linuxkafe_gamification',
		'type'     => 'checkbox',
		'priority' => 50,
	) );

	// Easter Eggs toggle
	$wp_customize->add_setting( 'linuxkafe_gamification_easter_eggs', array(
		'default'           => true,
		'type'              => 'theme_mod',
		'sanitize_callback' => 'linuxkafe_sanitize_checkbox',
	) );
	$wp_customize->add_control( 'linuxkafe_gamification_easter_eggs', array(
		'label'    => __( 'Easter Eggs (Konami, God Mode, IDKFA)', 'linuxkafe' ),
		'section'  => 'linuxkafe_gamification',
		'type'     => 'checkbox',
		'priority' => 60,
	) );
}

/* ========================================================= */
/* LAYOUT SYSTEM — Customizer Section (T006)                 */
/* ========================================================= */

// Section
$wp_customize->add_section( 'linuxkafe_layouts', array(
	'title'       => __( 'Layout', 'linuxkafe' ),
	'description' => __( 'Choose the site layout style.', 'linuxkafe' ),
	'priority'    => 40,
	'panel'       => '',
) );

// Layout type setting
$wp_customize->add_setting( 'linuxkafe_layout_type', array(
	'default'           => 'semiboxed',
	'type'              => 'theme_mod',
	'sanitize_callback' => 'linuxkafe_sanitize_layout_type',
	'transport'         => 'postMessage',
) );

$wp_customize->add_control( 'linuxkafe_layout_type', array(
	'label'    => __( 'Site Layout', 'linuxkafe' ),
	'section'  => 'linuxkafe_layouts',
	'type'     => 'radio',
	'priority' => 10,
	'choices'  => array(
		'wide'          => esc_attr__( 'Wide', 'linuxkafe' ),
		'semiboxed'     => esc_attr__( 'Semi Boxed', 'linuxkafe' ),
		'boxed'         => esc_attr__( 'Boxed', 'linuxkafe' ),
		'boxed-margin'  => esc_attr__( 'Boxed Margin', 'linuxkafe' ),
	),
) );

/**
 * Sanitize layout type.
 *
 * @param string $value Layout value.
 * @return string Sanitized layout value.
 */
function linuxkafe_sanitize_layout_type( $value ) {
	$valid = array( 'wide', 'semiboxed', 'boxed', 'boxed-margin' );
	return in_array( $value, $valid, true ) ? $value : 'semiboxed';
}
add_action( 'customize_register', 'linuxkafe_customize_register' );

/**
 * Sanitize checkbox (boolean).
 */
function linuxkafe_sanitize_checkbox( $value ) {
	return (bool) $value;
}

/**
 * Render the site title for the selective refresh partial.
 *
 * @return void
 */
function linuxkafe_customize_partial_blogname() {
	bloginfo( 'name' );
}

/**
 * Render the site tagline for the selective refresh partial.
 *
 * @return void
 */
function linuxkafe_customize_partial_blogdescription() {
	bloginfo( 'description' );
}

/**
 * Binds JS handlers to make Theme Customizer preview reload changes asynchronously.
 */
function linuxkafe_customize_preview_js() {
	wp_enqueue_script( 'linuxkafe-customizer', get_template_directory_uri() . '/js/customizer.js', array( 'customize-preview' ), _S_VERSION, true );
}
add_action( 'customize_preview_init', 'linuxkafe_customize_preview_js' );
