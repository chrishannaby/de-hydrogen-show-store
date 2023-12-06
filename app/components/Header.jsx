import {Await, NavLink} from '@remix-run/react';
import {Suspense} from 'react';
import {useRootLoaderData} from '~/root';

/**
 * @param {HeaderProps}
 */
export function Header({header, isLoggedIn, cart}) {
  const {shop, menu} = header;
  return (
    <header className="flex justify-between px-32 py-6 placeholde">
      <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
        <span className="flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="9"
            viewBox="0 0 36 9"
            fill="none"
          >
            <path
              d="M6.18877 1.57632V8.91725H4.35937V1.57632H0.443359V0H10.1072V1.57632H6.18877Z"
              fill="#262626"
            />
            <path
              d="M22.9222 0V8.91725H21.0928V5.13024H15.3955V8.91725H13.5781V0H15.3955V3.55152H21.0928V0H22.9222Z"
              fill="#262626"
            />
            <path
              d="M35.5287 0V1.57632H28.7328V3.56354H34.8244V5.12784H28.7328V7.33853H35.5287V8.91485H26.9395V0H35.5287Z"
              fill="#262626"
            />
          </svg>
        </span>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="190"
            height="27"
            viewBox="0 0 190 27"
            fill="none"
            className="my-2"
          >
            <path
              d="M0 0.256104H17.3997C23.1259 0.256104 26.376 2.78158 26.376 7.34714C26.376 10.5406 24.3062 12.2851 22.496 13.0661C25.1548 13.9576 27.1885 16.2211 27.1885 19.4531C27.1885 24.1316 23.6427 26.9166 18.0271 26.9166H0V0.258507V0.256104ZM16.8468 11.0981C19.5801 11.0981 21.2436 10.0576 21.2436 7.94306C21.2436 5.82849 19.5801 4.78802 16.8468 4.78802H5.20933V11.1005H16.8468V11.0981ZM5.20933 22.3486H17.6593C20.3565 22.3486 21.9455 20.9741 21.9455 18.934C21.9455 16.894 20.3565 15.5171 17.6593 15.5171H5.20933V22.3486Z"
              fill="#262626"
            />
            <path
              d="M44.7762 26.9142H39.3457V0.256104H56.0074C62.0293 0.256104 66.0919 3.15163 66.0919 8.64712C66.0919 12.7321 63.7264 15.4426 59.9595 16.4807L66.7193 26.9142H60.4763L54.2333 17.0021H44.7762V26.9142ZM55.7117 12.4341C58.8897 12.4341 60.6999 11.0597 60.6999 8.68316C60.6999 6.30667 58.8897 4.89615 55.7117 4.89615H44.7762V12.4341H55.7117Z"
              fill="#262626"
            />
            <path
              d="M95.3132 0.256104L108.686 26.9142H102.814L99.7461 20.7146H84.7479L81.6445 26.9142H75.8438L89.2169 0.256104H95.3132ZM87.0389 16.0722H97.4191L92.2482 5.63866L87.0389 16.0722Z"
              fill="#262626"
            />
            <path
              d="M147.405 26.9144H142.602L125.277 7.1984V26.9144H120.031V0.256348H125.572L142.123 19.0809V0.256348H147.407V26.9144H147.405Z"
              fill="#262626"
            />
            <path
              d="M161.258 0.256348H174.816C184.126 0.256348 189.999 5.45387 189.999 13.5854C189.999 21.7169 184.126 26.9144 174.816 26.9144H161.258V0.256348ZM174.816 22.2359C180.874 22.2359 184.458 18.8189 184.458 13.5854C184.458 8.3518 180.874 4.93484 174.816 4.93484H166.578V22.2359H174.816Z"
              fill="#262626"
            />
          </svg>
          <div className="flex items-center justify-center space-x-1">
            <p className="text-xs">Powered By</p>
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="55"
                height="16"
                viewBox="0 0 55 16"
                fill="none"
              >
                <path
                  d="M18.8346 8.73534C18.372 8.4812 18.1285 8.27547 18.1285 7.98503C18.1285 7.60987 18.4572 7.37993 18.9808 7.37993C19.5895 7.37993 20.1253 7.63407 20.1253 7.63407L20.5514 6.33917C20.5514 6.33917 20.1618 6.03662 19.0051 6.03662C17.3979 6.03662 16.2777 6.95637 16.2777 8.23917C16.2777 8.96528 16.8013 9.52197 17.4953 9.92133C18.0554 10.236 18.2502 10.4659 18.2502 10.7927C18.2502 11.1436 17.9702 11.422 17.4466 11.422C16.6674 11.422 15.9368 11.0226 15.9368 11.0226L15.4863 12.3175C15.4863 12.3175 16.1682 12.7653 17.3005 12.7653C18.9564 12.7653 20.1374 11.9545 20.1374 10.5022C20.1618 9.7035 19.553 9.14681 18.8346 8.73534Z"
                  fill="#262626"
                />
                <path
                  d="M25.4342 6.01297C24.6184 6.01297 23.9852 6.40023 23.486 6.98112L23.4617 6.96902L24.1679 3.29004H22.3172L20.5273 12.6448H22.3659L22.9747 9.44991C23.2182 8.23972 23.8391 7.5015 24.4236 7.5015C24.8375 7.5015 24.9958 7.77984 24.9958 8.17921C24.9958 8.43335 24.9715 8.73589 24.9106 8.99003L24.2166 12.6569H26.0551L26.7735 8.88112C26.8587 8.48175 26.9074 8.00978 26.9074 7.68303C26.9318 6.63016 26.396 6.01297 25.4342 6.01297Z"
                  fill="#262626"
                />
                <path
                  d="M31.0955 6.01221C28.8795 6.01221 27.4062 7.99692 27.4062 10.2116C27.4062 11.6275 28.2829 12.7772 29.9388 12.7772C32.1182 12.7772 33.5793 10.8409 33.5793 8.57781C33.5915 7.2587 32.8244 6.01221 31.0955 6.01221ZM30.1945 11.3612C29.5613 11.3612 29.3057 10.8288 29.3057 10.1632C29.3057 9.11029 29.8536 7.40393 30.852 7.40393C31.5095 7.40393 31.7164 7.96061 31.7164 8.5052C31.7164 9.64278 31.1685 11.3612 30.1945 11.3612Z"
                  fill="#262626"
                />
                <path
                  d="M38.3046 6.01221C37.0627 6.01221 36.3565 7.10138 36.3565 7.10138H36.3322L36.4417 6.12112H34.8102C34.725 6.78673 34.5789 7.79119 34.4327 8.55361L33.1543 15.2339H34.9928L35.5042 12.523H35.5407C35.5407 12.523 35.9182 12.7651 36.6244 12.7651C38.7917 12.7651 40.204 10.5625 40.204 8.33577C40.204 7.11348 39.6561 6.01221 38.3046 6.01221ZM36.5513 11.3976C36.0765 11.3976 35.7964 11.1313 35.7964 11.1313L36.1008 9.42494C36.32 8.28736 36.9166 7.52494 37.5497 7.52494C38.1098 7.52494 38.2803 8.04533 38.2803 8.5294C38.2803 9.70329 37.5741 11.3976 36.5513 11.3976Z"
                  fill="#262626"
                />
                <path
                  d="M42.8327 3.38623C42.2483 3.38623 41.7734 3.8461 41.7734 4.4512C41.7734 4.99578 42.1144 5.37094 42.6379 5.37094H42.6623C43.2345 5.37094 43.7337 4.98368 43.7459 4.30597C43.7581 3.76139 43.3928 3.38623 42.8327 3.38623Z"
                  fill="#262626"
                />
                <path
                  d="M40.252 12.6438H42.1027L43.3568 6.15723H41.4939L40.252 12.6438Z"
                  fill="#262626"
                />
                <path
                  d="M48.0338 6.14601H46.7553L46.8162 5.84346C46.9258 5.21417 47.2911 4.65748 47.912 4.65748C48.2408 4.65748 48.4964 4.75429 48.4964 4.75429L48.8617 3.32627C48.8617 3.32627 48.5451 3.16895 47.8633 3.16895C47.2058 3.16895 46.5605 3.35047 46.0613 3.77404C45.4282 4.30652 45.136 5.06894 44.9898 5.84346L44.9411 6.14601H44.0888L43.821 7.52563H44.6733L43.6992 12.6447H45.5377L46.5118 7.52563H47.7781L48.0338 6.14601Z"
                  fill="#262626"
                />
                <path
                  d="M52.4646 6.15723C52.4646 6.15723 51.3079 9.03748 50.7965 10.6107H50.7721C50.7356 10.1024 50.3216 6.15723 50.3216 6.15723H48.3857L49.4937 12.1114C49.518 12.2445 49.5059 12.3292 49.4572 12.4139C49.238 12.8254 48.8849 13.2247 48.4588 13.5152C48.1178 13.7693 47.7282 13.9266 47.4238 14.0356L47.9352 15.5846C48.3127 15.4999 49.0797 15.1973 49.7372 14.5923C50.5773 13.8056 51.3566 12.6075 52.148 10.9617L54.4005 6.15723H52.4646Z"
                  fill="#262626"
                />
                <path
                  d="M9.14316 1.94701C9.14316 1.94701 8.9727 1.99541 8.69266 2.08013C8.64396 1.9228 8.5709 1.74127 8.4735 1.54764C8.15693 0.942548 7.68208 0.615797 7.122 0.615797C7.08547 0.615797 7.04894 0.615797 7.00024 0.627899C6.98806 0.603695 6.96371 0.591593 6.95154 0.567389C6.70802 0.301147 6.39145 0.180128 6.01401 0.19223C5.28347 0.216434 4.55292 0.736816 3.96849 1.66866C3.55452 2.32216 3.23795 3.14509 3.15272 3.78649C2.31259 4.04063 1.72816 4.22216 1.71599 4.23426C1.28984 4.36738 1.27766 4.37949 1.22896 4.77885C1.19243 5.0814 0.0722656 13.6011 0.0722656 13.6011L9.27709 15.1865V1.9349C9.20404 1.9349 9.16751 1.94701 9.14316 1.94701ZM7.01241 2.60051C6.52539 2.74573 5.98966 2.91516 5.4661 3.07248C5.61221 2.50369 5.90443 1.9349 6.24535 1.55974C6.37928 1.42662 6.56191 1.2693 6.7689 1.17248C6.97589 1.60815 7.02459 2.20114 7.01241 2.60051ZM6.01401 0.688408C6.18447 0.688408 6.33058 0.724714 6.45233 0.797325C6.25752 0.89414 6.06271 1.05146 5.88007 1.23299C5.4174 1.72917 5.0643 2.50369 4.91819 3.24191C4.47987 3.37503 4.04154 3.50815 3.63975 3.62917C3.90761 2.46739 4.89384 0.712612 6.01401 0.688408ZM4.60163 7.34445C4.65033 8.11897 6.70802 8.2884 6.82978 10.1158C6.91501 11.5559 6.06271 12.5362 4.83296 12.6088C3.34753 12.7056 2.53176 11.8343 2.53176 11.8343L2.84833 10.503C2.84833 10.503 3.6641 11.1202 4.32159 11.0718C4.74773 11.0476 4.90602 10.6967 4.89384 10.4546C4.83296 9.43808 3.15272 9.49859 3.04314 7.82853C2.94573 6.42471 3.87108 5.00879 5.9166 4.87566C6.70802 4.82726 7.10982 5.02089 7.10982 5.02089L6.64714 6.76356C6.64714 6.76356 6.12359 6.52152 5.50263 6.56993C4.60163 6.63044 4.58945 7.19923 4.60163 7.34445ZM7.49944 2.45528C7.49944 2.09223 7.45074 1.57185 7.28028 1.13618C7.84036 1.2451 8.10823 1.86229 8.22998 2.23745C8.01082 2.29796 7.76731 2.37057 7.49944 2.45528Z"
                  fill="#262626"
                />
                <path
                  d="M9.55859 15.1617L13.3818 14.2178C13.3818 14.2178 11.738 3.16876 11.7259 3.09615C11.7137 3.02354 11.6528 2.97513 11.5919 2.97513C11.5311 2.97513 10.4596 2.95093 10.4596 2.95093C10.4596 2.95093 9.80211 2.32163 9.55859 2.07959V15.1617Z"
                  fill="#262626"
                />
              </svg>
            </span>
          </div>
        </span>
      </NavLink>
      <HeaderMenu
        menu={menu}
        viewport="desktop"
        primaryDomainUrl={header.shop.primaryDomain.url}
      />
      <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
    </header>
  );
}

/**
 * @param {{
 *   menu: HeaderProps['header']['menu'];
 *   primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
 *   viewport: Viewport;
 * }}
 */
export function HeaderMenu({menu, primaryDomainUrl, viewport}) {
  const {publicStoreDomain} = useRootLoaderData();
  const className = `header-menu-${viewport}`;

  function closeAside(event) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={closeAside}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className="header-menu-item uppercase font-normal "
            end
            key={item.id}
            onClick={closeAside}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>}
 */
function HeaderCtas({isLoggedIn, cart}) {
  return (
    <nav id="header-ctas" className="flex space-x-4" role="navigation">
      <HeaderMenuMobileToggle />
      <SearchToggle />
      <NavLink prefetch="intent" to="/account" style={activeLinkStyle}>
        {isLoggedIn ? (
          'Account'
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
        )}
      </NavLink>
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  return (
    <a className="header-menu-mobile-toggle" href="#mobile-menu-aside">
      <h3>☰</h3>
    </a>
  );
}

function SearchToggle() {
  return (
    <a href="#search-aside">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
    </a>
  );
}

/**
 * @param {{count: number}}
 */
function CartBadge({count}) {
  return (
    <a href="#cart-aside" className="relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        />
      </svg>
      <span className="absolute top-0 right-0  w-4 h-4   bg-white border border-black text-xs rounded-lg text-center">
        {count}
      </span>
    </a>
  );
}

/**
 * @param {Pick<HeaderProps, 'cart'>}
 */
function CartToggle({cart}) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        {(cart) => {
          if (!cart) return <CartBadge count={0} />;
          return <CartBadge count={cart.totalQuantity || 0} />;
        }}
      </Await>
    </Suspense>
  );
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

/**
 * @param {{
 *   isActive: boolean;
 *   isPending: boolean;
 * }}
 */
function activeLinkStyle({isActive, isPending}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}

/** @typedef {Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn'>} HeaderProps */
/** @typedef {'desktop' | 'mobile'} Viewport */

/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('./Layout').LayoutProps} LayoutProps */
