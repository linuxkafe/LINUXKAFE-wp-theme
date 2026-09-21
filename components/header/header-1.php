<?php
/**
 * Header 1 — Solid Background with Top Bar, Client Area, Branding & Navigation
 * Template part for 'components/header/header-1'
 *
 * @package linuxkafe
 */
?>
<header id="masthead" class="site-header header-style-1" role="banner">
	<div class="header-container">
		<!-- Top Bar -->
		<div class="top-bar-wrapper">
			<div class="top-bar-inner">
				<?php get_template_part( 'components/header/top-bar-elements' ); ?>
				<?php get_template_part( 'components/header/top-support' ); ?>
			</div>
		</div>

		<!-- Main Header: Branding + Navigation -->
		<div class="main-header-wrapper">
			<div class="main-header-inner">
				<?php get_template_part( 'components/header/site-branding' ); ?>

				<nav id="site-navigation" class="main-navigation" role="navigation" aria-label="<?php esc_attr_e( 'Primary Menu', 'linuxkafe' ); ?>">
					<input class="menu-btn" type="checkbox" id="menu-btn" aria-hidden="true" />
					<label class="menu-icon" for="menu-btn" aria-label="<?php esc_attr_e( 'Toggle Menu', 'linuxkafe' ); ?>">
						<span class="navicon" aria-hidden="true"></span>
					</label>

					<?php
					wp_nav_menu(
						array(
							'theme_location' => 'menu-1',
							'menu_id'        => 'primary-menu',
							'menu_class'     => 'menu',
							'container'      => false,
							'fallback_cb'    => '__return_false',
						)
					);
					?>
				</nav>
			</div>
		</div>
	</div>
</header>