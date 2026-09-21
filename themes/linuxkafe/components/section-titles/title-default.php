<?php
/**
 * Header 3 / Section Title — Minimal Header (Hidden Elements)
 * Template part for 'components/section-titles/title-default'
 * Used when header_style is 'header_3'
 *
 * @package linuxkafe
 */

// Only show on non-front pages
if ( is_front_page() ) {
	return;
}
?>
<header id="masthead" class="site-header header-style-3" role="banner">
	<div class="header-container">
		<div class="section-title-wrapper">
			<?php get_template_part( 'components/section-titles/title-content' ); ?>
		</div>
	</div>
</header>