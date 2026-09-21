<?php
/**
 * Top Bar Elements Component
 * Displays configurable top bar elements (icon + title + link)
 *
 * @package linuxkafe
 */

$show_elements = get_theme_mod( 'linuxkafe_topbar_show_elements', 'show' );
$align_elements = get_theme_mod( 'linuxkafe_topbar_align', 'left' );
$topbar_elements = get_theme_mod( 'linuxkafe_topbar_elements', array() );

// Default elements if none configured
if ( empty( $topbar_elements ) ) {
	$topbar_elements = array(
		array(
			'icon_class' => 'fa fa-plane',
			'title_text' => __( 'Support', 'linuxkafe' ),
			'link_url'   => '#',
		),
		array(
			'icon_class' => 'fa fa-cogs',
			'title_text' => __( 'Client Area', 'linuxkafe' ),
			'link_url'   => '#',
		),
		array(
			'icon_class' => 'fa fa-phone',
			'title_text' => __( 'Call Now', 'linuxkafe' ),
			'link_url'   => 'tel:+5511999999999',
		),
	);
}

if ( $show_elements !== 'show' ) {
	return;
}
?>
<div class="top-bar-elements topbar-align-<?php echo esc_attr( $align_elements ); ?>" role="navigation" aria-label="<?php esc_attr_e( 'Top Bar Links', 'linuxkafe' ); ?>">
	<ul class="topbar-list">
		<?php foreach ( $topbar_elements as $index => $element ) :
			$icon = ! empty( $element['icon_class'] ) ? esc_attr( $element['icon_class'] ) : '';
			$title = ! empty( $element['title_text'] ) ? esc_html( $element['title_text'] ) : '';
			$url = ! empty( $element['link_url'] ) ? esc_url( $element['link_url'] ) : '#';
			?>
			<li class="topbar-item">
				<a href="<?php echo $url; ?>" class="topbar-link" target="_blank" rel="noopener noreferrer">
					<?php if ( $icon ) : ?>
						<i class="<?php echo $icon; ?>" aria-hidden="true"></i>
					<?php endif; ?>
					<span class="topbar-text"><?php echo $title; ?></span>
				</a>
			</li>
		<?php endforeach; ?>
	</ul>
</div>