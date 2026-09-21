<?php
/**
 * Site Branding Component
 * Shared across Header 1 and Header 2
 *
 * @package linuxkafe
 */
?>
<div class="site-branding">
	<?php
	the_custom_logo();

	if ( is_front_page() && is_home() ) :
		?>
		<h1 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>
		<?php
	else :
		?>
		<p class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></p>
		<?php
	endif;

	$linuxkafe_description = get_bloginfo( 'description', 'display' );
	if ( $linuxkafe_description || is_customize_preview() ) :
		?>
		<p class="site-description"><?php echo $linuxkafe_description; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></p>
	<?php endif; ?>
</div>