<?php
/**
 * Client Area / Support Component (Header 1 only)
 * Visual login form - no backend processing
 *
 * @package linuxkafe
 */

$show_support = get_theme_mod( 'linuxkafe_header_show_support', 'show' );

if ( $show_support !== 'show' ) {
	return;
}

$login_user = get_theme_mod( 'linuxkafe_header_login_user', __( 'Username', 'linuxkafe' ) );
$login_password = get_theme_mod( 'linuxkafe_header_login_password', __( 'Password', 'linuxkafe' ) );
$login_button = get_theme_mod( 'linuxkafe_header_login_button', __( 'Login', 'linuxkafe' ) );
$close_title = get_theme_mod( 'linuxkafe_header_close_title', __( 'Close', 'linuxkafe' ) );
$open_title = get_theme_mod( 'linuxkafe_header_open_title', __( 'Open', 'linuxkafe' ) );
?>
<div class="client-area" role="region" aria-label="<?php esc_attr_e( 'Client Area', 'linuxkafe' ); ?>">
	<button type="button" class="client-area-toggle" aria-expanded="false" aria-controls="client-area-form" aria-label="<?php echo esc_attr( $open_title ); ?>">
		<span class="toggle-icon" aria-hidden="true"><i class="fa fa-user" aria-hidden="true"></i></span>
		<span class="toggle-text"><?php echo esc_html( $open_title ); ?></span>
	</button>

	<div id="client-area-form" class="client-area-form" hidden>
		<form class="login-form" action="#" method="post" onsubmit="return false;">
			<div class="form-row">
				<label for="client-user" class="screen-reader-text"><?php echo esc_html( $login_user ); ?></label>
				<input type="text" id="client-user" name="client_user" placeholder="<?php echo esc_attr( $login_user ); ?>" autocomplete="username" />
			</div>
			<div class="form-row">
				<label for="client-pass" class="screen-reader-text"><?php echo esc_html( $login_password ); ?></label>
				<input type="password" id="client-pass" name="client_pass" placeholder="<?php echo esc_attr( $login_password ); ?>" autocomplete="current-password" />
			</div>
			<button type="submit" class="btn btn-login"><?php echo esc_html( $login_button ); ?></button>
			<button type="button" class="btn btn-close-client-area" aria-label="<?php echo esc_attr( $close_title ); ?>"><?php echo esc_html( $close_title ); ?></button>
		</form>
	</div>
</div>