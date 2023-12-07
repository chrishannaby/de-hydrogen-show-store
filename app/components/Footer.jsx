import {NavLink} from '@remix-run/react';
import {useRootLoaderData} from '~/root';

/**
 * @param {FooterQuery & {shop: HeaderQuery['shop']}}
 */
export function Footer({menu, shop}) {
  return (
    <footer className="footer">
      <FooterMenu menu={menu} primaryDomainUrl={shop.primaryDomain.url} />
    </footer>
  );
}

/**
 * @param {{
 *   menu: FooterQuery['menu'];
 *   primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
 * }}
 */
function FooterMenu({menu, primaryDomainUrl}) {
  const {publicStoreDomain} = useRootLoaderData();

  return (
    <nav className="px-32 text-darkGray" role="navigation">
      <div className="grid grid-cols-3 gap-4">
        <h3 className="uppercase font-bold">Quick Links</h3>
        <h3 className="font-bold">Info</h3>
        <h3 className="font-bold">Our Mission</h3>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="grid grid-cols-2 col-span-2 gap-4">
          {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
            if (!item.url) return null;
            // if the url is internal, we strip the domain
            const url =
              item.url.includes('myshopify.com') ||
              item.url.includes(publicStoreDomain) ||
              item.url.includes(primaryDomainUrl)
                ? new URL(item.url).pathname
                : item.url;
            const isExternal = !url.startsWith('/');
            return isExternal ? (
              <a
                href={url}
                key={item.id}
                rel="noopener noreferrer"
                target="_blank"
              >
                {item.title}
              </a>
            ) : (
              <NavLink
                end
                key={item.id}
                prefetch="intent"
                className="text-darkyGray font-light text-sm"
                style={activeLinkStyle}
                to={url}
              >
                {item.title}
              </NavLink>
            );
          })}
        </div>
        <p className="text-black font-light text-sm">
          MR PORTER’s Mission is to help men lead stylish, happy and fulfilling
          lives. As a modern and truly global business, we recognise that these
          goals come with responsibilities. So, Our Pledge – built on the
          pillars of Community, Experience and Product – is made to the people
          who shop, work and spend time with us. It is also made to the planet
          we all live on.
        </p>
      </div>
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
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

/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
