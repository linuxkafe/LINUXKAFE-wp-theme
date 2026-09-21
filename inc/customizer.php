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
		'panel'       => '',
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

	/* ========================================================= */
	/* HEADER STYLES — Customizer Section (T007)                 */
	/* ========================================================= */

	// Section
	$wp_customize->add_section( 'linuxkafe_header_styles', array(
		'title'       => __( 'Header Style', 'linuxkafe' ),
		'description' => __( 'Choose the header layout and style.', 'linuxkafe' ),
		'priority'    => 30,
		'panel'       => '',
	) );

	// Header style setting
	$wp_customize->add_setting( 'linuxkafe_header_style', array(
		'default'           => 'header_1',
		'type'              => 'theme_mod',
		'sanitize_callback' => 'linuxkafe_sanitize_header_style',
		'transport'         => 'postMessage',
	) );

	$wp_customize->add_control( 'linuxkafe_header_style', array(
		'label'    => __( 'Header Style', 'linuxkafe' ),
		'section'  => 'linuxkafe_header_styles',
		'type'     => 'radio',
		'priority' => 10,
		'choices'  => array(
			'header_1' => esc_attr__( 'Header 1 (Solid Background + Client Area)', 'linuxkafe' ),
			'header_2' => esc_attr__( 'Header 2 (Transparent Background)', 'linuxkafe' ),
			'header_3' => esc_attr__( 'Header 3 (Minimal / Section Title Only)', 'linuxkafe' ),
		),
	) );

	// Client Area fields (Header 1 only)
	$wp_customize->add_setting( 'linuxkafe_header_show_support', array(
		'default'           => 'show',
		'type'              => 'theme_mod',
		'sanitize_callback' => 'linuxkafe_sanitize_header_show_support',
	) );
	$wp_customize->add_control( 'linuxkafe_header_show_support', array(
		'label'            => __( 'Show Client Area', 'linuxkafe' ),
		'section'          => 'linuxkafe_header_styles',
		'type'             => 'radio',
		'priority'         => 20,
		'choices'          => array(
			'show'   => esc_attr__( 'Show', 'linuxkafe' ),
			'hidden' => esc_attr__( 'Hidden', 'linuxkafe' ),
		),
		'active_callback'  => array(
			array(
				'setting'  => 'linuxkafe_header_style',
				'operator' => '==',
				'value'    => 'header_1',
			),
		),
	) );

	$wp_customize->add_setting( 'linuxkafe_header_login_user', array(
		'default'           => __( 'Username', 'linuxkafe' ),
		'type'              => 'theme_mod',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'linuxkafe_header_login_user', array(
		'label'            => __( 'User Placeholder', 'linuxkafe' ),
		'section'          => 'linuxkafe_header_styles',
		'type'             => 'text',
		'priority'         => 21,
		'active_callback'  => array(
			array(
				'setting'  => 'linuxkafe_header_style',
				'operator' => '==',
				'value'    => 'header_1',
			),
			array(
				'setting'  => 'linuxkafe_header_show_support',
				'operator' => '==',
				'value'    => 'show',
			),
		),
	) );

	$wp_customize->add_setting( 'linuxkafe_header_login_password', array(
		'default'           => __( 'Password', 'linuxkafe' ),
		'type'              => 'theme_mod',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'linuxkafe_header_login_password', array(
		'label'            => __( 'Password Placeholder', 'linuxkafe' ),
		'section'          => 'linuxkafe_header_styles',
		'type'             => 'text',
		'priority'         => 22,
		'active_callback'  => array(
			array(
				'setting'  => 'linuxkafe_header_style',
				'operator' => '==',
				'value'    => 'header_1',
			),
			array(
				'setting'  => 'linuxkafe_header_show_support',
				'operator' => '==',
				'value'    => 'show',
			),
		),
	) );

	$wp_customize->add_setting( 'linuxkafe_header_login_button', array(
		'default'           => __( 'Login', 'linuxkafe' ),
		'type'              => 'theme_mod',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'linuxkafe_header_login_button', array(
		'label'            => __( 'Login Button Text', 'linuxkafe' ),
		'section'          => 'linuxkafe_header_styles',
		'type'             => 'text',
		'priority'         => 23,
		'active_callback'  => array(
			array(
				'setting'  => 'linuxkafe_header_style',
				'operator' => '==',
				'value'    => 'header_1',
			),
			array(
				'setting'  => 'linuxkafe_header_show_support',
				'operator' => '==',
				'value'    => 'show',
			),
		),
	) );

	$wp_customize->add_setting( 'linuxkafe_header_close_title', array(
		'default'           => __( 'Close', 'linuxkafe' ),
		'type'              => 'theme_mod',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'linuxkafe_header_close_title', array(
		'label'            => __( 'Close Button Text', 'linuxkafe' ),
		'section'          => 'linuxkafe_header_styles',
		'type'             => 'text',
		'priority'         => 24,
		'active_callback'  => array(
			array(
				'setting'  => 'linuxkafe_header_style',
				'operator' => '==',
				'value'    => 'header_1',
			),
			array(
				'setting'  => 'linuxkafe_header_show_support',
				'operator' => '==',
				'value'    => 'show',
			),
		),
	) );

	$wp_customize->add_setting( 'linuxkafe_header_open_title', array(
		'default'           => __( 'Open', 'linuxkafe' ),
		'type'              => 'theme_mod',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'linuxkafe_header_open_title', array(
		'label'            => __( 'Open Button Text', 'linuxkafe' ),
		'section'          => 'linuxkafe_header_styles',
		'type'             => 'text',
		'priority'         => 25,
		'active_callback'  => array(
			array(
				'setting'  => 'linuxkafe_header_style',
				'operator' => '==',
				'value'    => 'header_1',
			),
			array(
				'setting'  => 'linuxkafe_header_show_support',
				'operator' => '==',
				'value'    => 'show',
			),
		),
	) );

	/* ========================================================= */
	/* TOP BAR — Customizer Section (T007)                       */
	/* ========================================================= */

	// Top Bar Elements (repeater-like: 3 fixed items)
	$wp_customize->add_setting( 'linuxkafe_topbar_show_elements', array(
		'default'           => 'show',
		'type'              => 'theme_mod',
		'sanitize_callback' => 'linuxkafe_sanitize_topbar_show',
	) );
	$wp_customize->add_control( 'linuxkafe_topbar_show_elements', array(
		'label'    => __( 'Show Top Bar Elements', 'linuxkafe' ),
		'section'  => 'linuxkafe_header_styles',
		'type'     => 'radio',
		'priority' => 30,
		'choices'  => array(
			'show'   => esc_attr__( 'Show', 'linuxkafe' ),
			'hidden' => esc_attr__( 'Hidden', 'linuxkafe' ),
		),
	) );

	$wp_customize->add_setting( 'linuxkafe_topbar_align', array(
		'default'           => 'left',
		'type'              => 'theme_mod',
		'sanitize_callback' => 'linuxkafe_sanitize_topbar_align',
	) );
	$wp_customize->add_control( 'linuxkafe_topbar_align', array(
		'label'            => __( 'Align Elements', 'linuxkafe' ),
		'section'          => 'linuxkafe_header_styles',
		'type'             => 'radio',
		'priority'         => 31,
		'choices'          => array(
			'left'  => esc_attr__( 'Left', 'linuxkafe' ),
			'right' => esc_attr__( 'Right', 'linuxkafe' ),
		),
		'active_callback'  => array(
			array(
				'setting'  => 'linuxkafe_topbar_show_elements',
				'operator' => '==',
				'value'    => 'show',
			),
		),
	) );

	// Top Bar Element 1
	$wp_customize->add_setting( 'linuxkafe_topbar_element_1_icon', array(
		'default'           => 'fa fa-plane',
		'type'              => 'theme_mod',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'linuxkafe_topbar_element_1_icon', array(
		'label'            => __( 'Element 1 Icon Class', 'linuxkafe' ),
		'section'          => 'linuxkafe_header_styles',
		'type'             => 'text',
		'priority'         => 32,
		'description'      => __( 'Font Awesome class (e.g., fa fa-plane)', 'linuxkafe' ),
		'active_callback'  => array(
			array(
				'setting'  => 'linuxkafe_topbar_show_elements',
				'operator' => '==',
				'value'    => 'show',
			),
		),
	) );

	$wp_customize->add_setting( 'linuxkafe_topbar_element_1_title', array(
		'default'           => __( 'Support', 'linuxkafe' ),
		'type'              => 'theme_mod',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'linuxkafe_topbar_element_1_title', array(
		'label'            => __( 'Element 1 Title', 'linuxkafe' ),
		'section'          => 'linuxkafe_header_styles',
		'type'             => 'text',
		'priority'         => 33,
		'active_callback'  => array(
			array(
				'setting'  => 'linuxkafe_topbar_show_elements',
				'operator' => '==',
				'value'    => 'show',
			),
		),
	) );

	$wp_customize->add_setting( 'linuxkafe_topbar_element_1_url', array(
		'default'           => '#',
		'type'              => 'theme_mod',
		'sanitize_callback' => 'esc_url_raw',
	) );
	$wp_customize->add_control( 'linuxkafe_topbar_element_1_url', array(
		'label'            => __( 'Element 1 URL', 'linuxkafe' ),
		'section'          => 'linuxkafe_header_styles',
		'type'             => 'url',
		'priority'         => 34,
		'active_callback'  => array(
			array(
				'setting'  => 'linuxkafe_topbar_show_elements',
				'operator' => '==',
				'value'    => 'show',
			),
		),
	) );

	// Top Bar Element 2
	$wp_customize->add_setting( 'linuxkafe_topbar_element_2_icon', array(
		'default'           => 'fa fa-cogs',
		'type'              => 'theme_mod',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'linuxkafe_topbar_element_2_icon', array(
		'label'            => __( 'Element 2 Icon Class', 'linuxkafe' ),
		'section'          => 'linuxkafe_header_styles',
		'type'             => 'text',
		'priority'         => 35,
		'description'      => __( 'Font Awesome class (e.g., fa fa-cogs)', 'linuxkafe' ),
		'active_callback'  => array(
			array(
				'setting'  => 'linuxkafe_topbar_show_elements',
				'operator' => '==',
				'value'    => 'show',
			),
		),
	) );

	$wp_customize->add_setting( 'linuxkafe_topbar_element_2_title', array(
		'default'           => __( 'Client Area', 'linuxkafe' ),
		'type'              => 'theme_mod',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'linuxkafe_topbar_element_2_title', array(
		'label'            => __( 'Element 2 Title', 'linuxkafe' ),
		'section'          => 'linuxkafe_header_styles',
		'type'             => 'text',
		'priority'         => 36,
		'active_callback'  => array(
			array(
				'setting'  => 'linuxkafe_topbar_show_elements',
				'operator' => '==',
				'value'    => 'show',
			),
		),
	) );

	$wp_customize->add_setting( 'linuxkafe_topbar_element_2_url', array(
		'default'           => '#',
		'type'              => 'theme_mod',
		'sanitize_callback' => 'esc_url_raw',
	) );
	$wp_customize->add_control( 'linuxkafe_topbar_element_2_url', array(
		'label'            => __( 'Element 2 URL', 'linuxkafe' ),
		'section'          => 'linuxkafe_header_styles',
		'type'             => 'url',
		'priority'         => 37,
		'active_callback'  => array(
			array(
				'setting'  => 'linuxkafe_topbar_show_elements',
				'operator' => '==',
				'value'    => 'show',
			),
		),
	) );

	// Top Bar Element 3
	$wp_customize->add_setting( 'linuxkafe_topbar_element_3_icon', array(
		'default'           => 'fa fa-phone',
		'type'              => 'theme_mod',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'linuxkafe_topbar_element_3_icon', array(
		'label'            => __( 'Element 3 Icon Class', 'linuxkafe' ),
		'section'          => 'linuxkafe_header_styles',
		'type'             => 'text',
		'priority'         => 38,
		'description'      => __( 'Font Awesome class (e.g., fa fa-phone)', 'linuxkafe' ),
		'active_callback'  => array(
			array(
				'setting'  => 'linuxkafe_topbar_show_elements',
				'operator' => '==',
				'value'    => 'show',
			),
		),
	) );

	$wp_customize->add_setting( 'linuxkafe_topbar_element_3_title', array(
		'default'           => __( 'Call Now', 'linuxkafe' ),
		'type'              => 'theme_mod',
		'sanitize_callback' => 'sanitize_text_field',
	) );
	$wp_customize->add_control( 'linuxkafe_topbar_element_3_title', array(
		'label'            => __( 'Element 3 Title', 'linuxkafe' ),
		'section'          => 'linuxkafe_header_styles',
		'type'             => 'text',
		'priority'         => 39,
		'active_callback'  => array(
			array(
				'setting'  => 'linuxkafe_topbar_show_elements',
				'operator' => '==',
				'value'    => 'show',
			),
		),
	) );

	$wp_customize->add_setting( 'linuxkafe_topbar_element_3_url', array(
		'default'           => 'tel:+5511999999999',
		'type'              => 'theme_mod',
		'sanitize_callback' => 'esc_url_raw',
	) );
	$wp_customize->add_control( 'linuxkafe_topbar_element_3_url', array(
		'label'            => __( 'Element 3 URL', 'linuxkafe' ),
		'section'          => 'linuxkafe_header_styles',
		'type'             => 'url',
		'priority'         => 40,
		'active_callback'  => array(
			array(
				'setting'  => 'linuxkafe_topbar_show_elements',
				'operator' => '==',
				'value'    => 'show',
			),
		),
	) );

	/* ========================================================= */
	/* SECTION TITLES — Customizer Section (T007)                */
	/* ========================================================= */

	$wp_customize->add_setting( 'linuxkafe_section_title_align', array(
		'default'           => 'left',
		'type'              => 'theme_mod',
		'sanitize_callback' => 'linuxkafe_sanitize_section_title_align',
	) );
	$wp_customize->add_control( 'linuxkafe_section_title_align', array(
		'label'    => __( 'Align Titles', 'linuxkafe' ),
		'section'  => 'linuxkafe_header_styles',
		'type'     => 'radio',
		'priority' => 50,
		'choices'  => array(
			'left'   => esc_attr__( 'Left', 'linuxkafe' ),
			'center' => esc_attr__( 'Center', 'linuxkafe' ),
			'right'  => esc_attr__( 'Right', 'linuxkafe' ),
		),
	) );

	$wp_customize->add_setting( 'linuxkafe_section_title_breadcrumbs', array(
		'default'           => 'show',
		'type'              => 'theme_mod',
		'sanitize_callback' => 'linuxkafe_sanitize_section_title_breadcrumbs',
	) );
	$wp_customize->add_control( 'linuxkafe_section_title_breadcrumbs', array(
		'label'    => __( 'Show Breadcrumbs', 'linuxkafe' ),
		'section'  => 'linuxkafe_header_styles',
		'type'     => 'radio',
		'priority' => 51,
		'choices'  => array(
			'show'   => esc_attr__( 'Show', 'linuxkafe' ),
			'hidden' => esc_attr__( 'Hidden', 'linuxkafe' ),
		),
	) );

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
}
add_action( 'customize_register', 'linuxkafe_customize_register' );

/**
 * Sanitize header style.
 */
function linuxkafe_sanitize_header_style( $value ) {
	$valid = array( 'header_1', 'header_2', 'header_3' );
	return in_array( $value, $valid, true ) ? $value : 'header_1';
}

/**
 * Sanitize header show support.
 */
function linuxkafe_sanitize_header_show_support( $value ) {
	return in_array( $value, array( 'show', 'hidden' ), true ) ? $value : 'show';
}

/**
 * Sanitize topbar show.
 */
function linuxkafe_sanitize_topbar_show( $value ) {
	return in_array( $value, array( 'show', 'hidden' ), true ) ? $value : 'show';
}

/**
 * Sanitize topbar align.
 */
function linuxkafe_sanitize_topbar_align( $value ) {
	return in_array( $value, array( 'left', 'right' ), true ) ? $value : 'left';
}

/**
 * Sanitize section title align.
 */
function linuxkafe_sanitize_section_title_align( $value ) {
	return in_array( $value, array( 'left', 'center', 'right' ), true ) ? $value : 'left';
}

/**
 * Sanitize section title breadcrumbs.
 */
function linuxkafe_sanitize_section_title_breadcrumbs( $value ) {
	return in_array( $value, array( 'show', 'hidden' ), true ) ? $value : 'show';
}

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