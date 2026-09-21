<?php
/**
 * Section Title Content
 * Displays page title and breadcrumbs
 *
 * @package linuxkafe
 */

$align_titles = get_theme_mod( 'linuxkafe_section_title_align', 'left' );
$show_breadcrumbs = get_theme_mod( 'linuxkafe_section_title_breadcrumbs', 'show' );
?>
<div class="section-title-content text-align-<?php echo esc_attr( $align_titles ); ?>">
	<?php if ( $show_breadcrumbs === 'show' ) : ?>
		<?php linuxkafe_breadcrumb_display(); ?>
	<?php endif; ?>

	<div class="page-header">
		<?php
		if ( is_single() ) {
			the_title( '<h1 class="entry-title">', '</h1>' );
		} elseif ( is_page() ) {
			the_title( '<h1 class="entry-title">', '</h1>' );
		} elseif ( is_archive() ) {
			the_archive_title( '<h1 class="page-title">', '</h1>' );
		} elseif ( is_search() ) {
			?>
			<h1 class="page-title">
				<?php
				printf(
					esc_html__( 'Search Results for: %s', 'linuxkafe' ),
					'<span>' . get_search_query() . '</span>'
				);
				?>
			</h1>
			<?php
		} elseif ( is_404() ) {
			?>
			<h1 class="page-title"><?php esc_html_e( 'Page Not Found', 'linuxkafe' ); ?></h1>
			<?php
		}
		?>
	</div>
</div>