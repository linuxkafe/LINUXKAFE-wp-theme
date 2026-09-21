<?php
/**
 * linuxkafe Theme Functions
 * Core theme functionality: layout system, pagination, breadcrumbs, etc.
 *
 * @package linuxkafe
 */

/**
 * Get current layout setting.
 * Checks ACF field first (per-page override), then Customizer theme_mod, defaults to 'semiboxed'.
 *
 * @return string Layout slug: 'wide', 'semiboxed', 'boxed', 'boxed-margin'
 */
function linuxkafe_layout_display() {
    $layout = 'semiboxed'; // Default

    // Check ACF field for per-page override (if ACF is active)
    if ( function_exists( 'get_field' ) ) {
        $acf_layout = get_field( 'layout_pages' );
        if ( $acf_layout && $acf_layout !== 'default' ) {
            return esc_attr( $acf_layout );
        }
    }

    // Fallback to Customizer theme_mod
    $customizer_layout = get_theme_mod( 'linuxkafe_layout_type', 'semiboxed' );
    if ( in_array( $customizer_layout, array( 'wide', 'semiboxed', 'boxed', 'boxed-margin' ), true ) ) {
        $layout = $customizer_layout;
    }

    return $layout;
}

/**
 * Add layout class to body tag.
 *
 * @param array $classes CSS classes for body element.
 * @return array Modified classes array.
 */
function linuxkafe_body_class_layout( $classes ) {
    $classes[] = 'layout-' . linuxkafe_layout_display();
    return $classes;
}
add_filter( 'body_class', 'linuxkafe_body_class_layout' );

/**
 * Custom excerpt length.
 *
 * @param int $length Default excerpt length.
 * @return int Custom excerpt length (45 words).
 */
function linuxkafe_custom_excerpt_length( $length ) {
    return 45;
}
add_filter( 'excerpt_length', 'linuxkafe_custom_excerpt_length' );

/**
 * Register Google Fonts URL.
 *
 * @return string Google Fonts CSS URL.
 */
function linuxkafe_google_font_url() {
    $font_url = '';

    // Translators: If there are characters in your language that are not supported
    // by Open Sans or Raleway, translate this to 'off'. Do not translate into your own language.
    if ( 'off' !== esc_html_x( 'on', 'Google font: on or off', 'linuxkafe' ) ) {
        $font_families = array(
            'Open+Sans:400italic,300,400,600,700',
            'Raleway:400,700',
        );
        $font_url = add_query_arg(
            array(
                'family' => implode( '|', $font_families ),
                'display' => 'swap',
            ),
            'https://fonts.googleapis.com/css'
        );
    }

    return $font_url;
}

/**
 * Pagination function for archive pages.
 *
 * @param string $numpages Total number of pages.
 * @param int    $pagerange Number of pages to show on each side of current.
 * @param int    $paged Current page number.
 */
function linuxkafe_pagination( $numpages = '', $pagerange = 2, $paged = '' ) {
    if ( empty( $paged ) ) {
        global $paged;
    }

    if ( empty( $numpages ) ) {
        global $wp_query;
        $numpages = $wp_query->max_num_pages;
        if ( ! $numpages ) {
            $numpages = 1;
        }
    }

    $pagination_args = array(
        'base'            => get_pagenum_link( 1 ) . '%_%',
        'total'           => $numpages,
        'current'         => $paged,
        'show_all'        => false,
        'end_size'        => 1,
        'mid_size'        => $pagerange,
        'prev_next'       => true,
        'prev_text'       => '&laquo;',
        'next_text'       => '&raquo;',
        'type'            => 'plain',
        'add_args'        => false,
        'add_fragment'    => '',
    );

    $paginate_links = paginate_links( $pagination_args );

    if ( $paginate_links ) {
        echo '<nav class="custom-pagination" aria-label="' . esc_attr__( 'Pagination', 'linuxkafe' ) . '">';
        echo $paginate_links;
        echo '</nav>';
    }
}

/**
 * Breadcrumbs display.
 * Pluggable function for breadcrumb navigation.
 */
if ( ! function_exists( 'linuxkafe_breadcrumb_display' ) ) {
    function linuxkafe_breadcrumb_display() {
        global $post;

        if ( is_front_page() ) {
            return;
        }

        $sep = '<li class="sep" aria-hidden="true">/</li>';
        $home_link = '<li class="breadcrumbs-home"><a href="' . esc_url( home_url( '/' ) ) . '">' . __( 'Home', 'linuxkafe' ) . '</a></li>';

        echo '<nav class="breadcrumbs" aria-label="' . esc_attr__( 'Breadcrumb', 'linuxkafe' ) . '">';
        echo '<ul class="breadcrumb-list">';
        echo $home_link;

        if ( is_page() && $post->post_parent ) {
            $ancestors = array_reverse( get_post_ancestors( $post ) );
            foreach ( $ancestors as $ancestor ) {
                echo $sep;
                printf(
                    '<li><a href="%s">%s</a></li>',
                    esc_url( get_permalink( $ancestor ) ),
                    esc_html( get_the_title( $ancestor ) )
                );
            }
            echo $sep;
            echo '<li class="current" aria-current="page">' . esc_html( get_the_title() ) . '</li>';
        } elseif ( is_single() ) {
            echo $sep;
            $categories = get_the_category();
            if ( $categories ) {
                echo '<li><a href="' . esc_url( get_category_link( $categories[0]->term_id ) ) . '">' . esc_html( $categories[0]->name ) . '</a></li>';
                echo $sep;
            }
            echo '<li class="current" aria-current="page">' . esc_html( get_the_title() ) . '</li>';
        } elseif ( is_archive() ) {
            echo $sep;
            the_archive_title( '<li class="current" aria-current="page">', '</li>' );
        } elseif ( is_search() ) {
            echo $sep;
            printf(
                '<li class="current" aria-current="page">%s: %s</li>',
                esc_html__( 'Search Results for', 'linuxkafe' ),
                esc_html( get_search_query() )
            );
        } elseif ( is_404() ) {
            echo $sep;
            echo '<li class="current" aria-current="page">' . esc_html__( '404 - Not Found', 'linuxkafe' ) . '</li>';
        }

        echo '</ul>';
        echo '</nav>';
    }
}

/**
 * Header display function - loads appropriate header template part.
 * Supports multiple header styles via Customizer.
 */
if ( ! function_exists( 'linuxkafe_header_display' ) ) {
    function linuxkafe_header_display() {
        $header_style = get_theme_mod( 'linuxkafe_header_style', 'header_1' );

        // Allow per-page override via ACF
        if ( function_exists( 'get_field' ) ) {
            $acf_header = get_field( 'style_header' );
            if ( $acf_header && $acf_header !== 'option_customizer' ) {
                $header_style = $acf_header;
            }
        }

        // Map header style to template part
        $template_map = array(
            'header_1' => 'components/header/header-1',
            'header_2' => 'components/header/header-2',
            'header_3' => 'components/section-titles/title-default',
        );

        $template = $template_map[ $header_style ] ?? 'components/header/header-1';
        get_template_part( $template );
    }
}