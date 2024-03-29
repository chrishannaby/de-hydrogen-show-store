import React, {Suspense, useEffect, useState} from 'react';
import {defer, redirect} from '@shopify/remix-oxygen';
import {Await, Link, useLoaderData} from '@remix-run/react';
import {CollectionProductGrid} from './_index';

import {
  Image,
  Money,
  VariantSelector,
  getSelectedProductOptions,
  CartForm,
} from '@shopify/hydrogen';
import {getVariantUrl} from '~/utils';

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  return [{title: `Hydrogen | ${data?.product.title ?? ''}`}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({params, request, context}) {
  const {handle} = params;
  const {storefront} = context;

  const selectedOptions = getSelectedProductOptions(request).filter(
    (option) =>
      // Filter out Shopify predictive search query params
      !option.name.startsWith('_sid') &&
      !option.name.startsWith('_pos') &&
      !option.name.startsWith('_psq') &&
      !option.name.startsWith('_ss') &&
      !option.name.startsWith('_v') &&
      // Filter out third party tracking params
      !option.name.startsWith('fbclid'),
  );

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  // await the query for the critical product data
  const {product} = await storefront.query(PRODUCT_QUERY, {
    variables: {handle, selectedOptions},
  });

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }


  const dropMetaObject = product.drop
    ? await storefront.query(METAOBJECT_QUERY, {
        variables: {
          id: product.drop.value,
        },
      })
    : null;


  //dropMetaObject.metaobject.fields.find((field) => field.key === 'end_time'),
  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option) => option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    // if no selected variant was returned from the selected options,
    // we redirect to the first variant's url with it's selected options applied
    if (!product.selectedVariant) {
      throw redirectToFirstVariant({product, request});
    }
  }

  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deffered query resolves, the UI will update.
  const variants = storefront.query(VARIANTS_QUERY, {
    variables: {handle},
  });

  const recommendedProducts = await storefront.query(
    RECOMMENDED_PRODUCTS_QUERY,
  );

  return defer({product, variants, recommendedProducts, dropMetaObject});
}

/**
 * @param {{
 *   product: ProductFragment;
 *   request: Request;
 * }}
 */
function redirectToFirstVariant({product, request}) {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes[0];

  return redirect(
    getVariantUrl({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {
      status: 302,
    },
  );
}

export default function Product() {
  /** @type {LoaderReturnData} */
  const {product, variants, recommendedProducts, dropMetaObject} =
    useLoaderData();
  const {selectedVariant} = product;
  const showHeader = false;
  return (
    <div className="page-width pt-12 pb-16">
      <div className="grid grid-cols-12  gap-x-16">
        <div className="col-span-8">
          <ProductImage image={selectedVariant?.image} />
        </div>
        <div className="col-span-4">
          <ProductMain
            selectedVariant={selectedVariant}
            product={product}
            variants={variants}
            dropMetaObject={dropMetaObject}
          />
        </div>
      </div>
      <div className="py-24">
        <h2 className="text-2xl font-bold py-6">Other Products</h2>
        <CollectionProductGrid
          products={recommendedProducts}
          showHeader={showHeader}
        />
      </div>
    </div>
  );
}

/**
 * @param {{image: ProductVariantFragment['image']}}
 */
function ProductImage({image}) {
  if (!image) {
    return <div className="product-image" />;
  }
  return (
    <div className="w-10/12">
      <Image
        alt={image.altText || 'Product Image'}
        data={image}
        key={image.id}
        sizes="(min-width: 45em) 50vw, 100vw"
      />
    </div>
  );
}

/**
 * @param {{
 *   product: ProductFragment;
 *   selectedVariant: ProductFragment['selectedVariant'];
 *   variants: Promise<ProductVariantsQuery>;
 * }}
 */
function ProductMain({selectedVariant, product, variants, dropMetaObject}) {
  const {title, descriptionHtml} = product;
  return (
    <div className="">
      <div className="space-y-2">
        <h2 className="text-xs">{product.vendor}</h2>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <h3 className="text-sm hidden">Sub Title</h3>
        <div className="">
          <ProductReviews />
        </div>
      </div>
      <div className="py-3">
        <ProductPrice selectedVariant={selectedVariant} />
      </div>
      <Suspense
        fallback={
          <ProductForm
            product={product}
            selectedVariant={selectedVariant}
            variants={[]}
            dropMetaObject={dropMetaObject}
          />
        }
      >
        <Await
          errorElement="There was a problem loading product variants"
          resolve={variants}
        >
          {(data) => (
            <ProductForm
              product={product}
              selectedVariant={selectedVariant}
              variants={data.product?.variants.nodes || []}
              dropMetaObject={dropMetaObject}
            />
          )}
        </Await>
      </Suspense>
      <p>
        <span className="text-darkGray font-semibold">Description</span>
      </p>
      <div
        className="pt-6 text-darkyGray font-light text-sm"
        dangerouslySetInnerHTML={{__html: descriptionHtml}}
      />
    </div>
  );
}

/**
 * @param {{
 *   selectedVariant: ProductFragment['selectedVariant'];
 * }}
 */
function ProductPrice({selectedVariant}) {
  return (
    <div className="product-price">
      {selectedVariant?.compareAtPrice ? (
        <>
          <p>Sale</p>
          <div className="product-price-on-sale">
            {selectedVariant ? <Money data={selectedVariant.price} /> : null}
            <s>
              <Money data={selectedVariant.compareAtPrice} />
            </s>
          </div>
        </>
      ) : (
        selectedVariant?.price && <Money data={selectedVariant?.price} />
      )}
    </div>
  );
}

/**
 * @param {{
 *   product: ProductFragment;
 *   selectedVariant: ProductFragment['selectedVariant'];
 *   variants: Array<ProductVariantFragment>;
 * }}
 */
function ProductForm({product, selectedVariant, variants, dropMetaObject}) {
  let dropEndTime;
  let dropStartTime;


  if (dropMetaObject) {
    dropStartTime = dropMetaObject.metaobject.fields.find(
      (field) => field.key === 'start_time',
    );
    dropEndTime = dropMetaObject.metaobject.fields.find(
      (field) => field.key === 'end_time',
    );
  }

  return (
    <div className="product-form">
      <div className="pb-4 space-y-6">
        <VariantSelector
          handle={product.handle}
          options={product.options}
          variants={variants}
        >
          {({option}) => <ProductOptions key={option.name} option={option} />}
        </VariantSelector>
      </div>
      <div className="pb-8">
        {dropMetaObject ? (
          <CountDownTimer
            endDateTime={dropEndTime.value}
            startDateTime={dropStartTime.value}
            content={
              <AddToCartButton
                disabled={!selectedVariant || !selectedVariant.availableForSale}
                onClick={() => {
                  window.location.href = window.location.href + '#cart-aside';
                }}
                lines={
                  selectedVariant
                    ? [
                        {
                          merchandiseId: selectedVariant.id,
                          quantity: 1,
                        },
                      ]
                    : []
                }
              >
                {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
              </AddToCartButton>
            }
          />
        ) : (
          <AddToCartButton
            disabled={!selectedVariant || !selectedVariant.availableForSale}
            onClick={() => {
              window.location.href = window.location.href + '#cart-aside';
            }}
            lines={
              selectedVariant
                ? [
                    {
                      merchandiseId: selectedVariant.id,
                      quantity: 1,
                    },
                  ]
                : []
            }
          >
            {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
          </AddToCartButton>
        )}
      </div>
    </div>
  );
}

function CountDownTimer({startDateTime, endDateTime, content}) {
  // Determine which date to count down to
  let countDownTo = {date: '', type: ''};

  countDownTo.date =
    new Date() < new Date(startDateTime) ? startDateTime : endDateTime;

  countDownTo.type =
    new Date() < new Date(startDateTime) ? 'startDateTime' : 'endDateTime';

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(countDownTo));
  const [showAddToCartButton, setShowAddToCartButton] = useState(false);

  function calculateTimeLeft(date) {
    const difference = +new Date(date) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  // Recalculate time left every second
  useEffect(() => {
    const timer = setTimeout(() => {
      const newTimeLeft = calculateTimeLeft(countDownTo.date);
      setTimeLeft(newTimeLeft);

      // If countdown is over, show the Add to Cart button
      if (
        !Object.keys(newTimeLeft).length ||
        countDownTo.type === 'endDateTime'
      ) {
        setShowAddToCartButton(true);
      }
    }, 1000);

    // Clear interval on re-render to avoid memory leaks
    return () => clearTimeout(timer);
  });

  return (
    <div className="space-y-4">
      <h3 className="text-2xl text-darkGray font-light">
        {countDownTo.type == 'endDateTime'
          ? 'Product available until:'
          : 'Product drops in:'}
      </h3>
      <div>
        {Object.keys(timeLeft).length > 0 ? (
          <div>
            <span className="text-2xl">{timeLeft.days}</span>d{' '}
            <span className="text-2xl">{timeLeft.hours}</span>h{' '}
            <span className="text-2xl">{timeLeft.minutes}</span>m{' '}
            <span className="text-2xl">{timeLeft.seconds}</span>s
          </div>
        ) : (
          <></>
        )}
      </div>
      {showAddToCartButton && content}
    </div>
  );
}

function ProductReviews({review}) {
  return (
    <div>
      <div className="flex items-center md:col-span-1">
        <div className="flex items-center">
          <svg
            className="text-yellow-400 h-3 w-3 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
              clipRule="evenodd"
            ></path>
          </svg>
          <svg
            className="text-yellow-400 h-3 w-3 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
              clipRule="evenodd"
            ></path>
          </svg>
          <svg
            className="text-yellow-400 h-3 w-3 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
              clipRule="evenodd"
            ></path>
          </svg>
          <svg
            className="text-yellow-400 h-3 w-3 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
              clipRule="evenodd"
            ></path>
          </svg>
          <svg
            className="text-yellow-400 h-3 w-3 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
}

/**
 * @param {{option: VariantOption}}
 */
function ProductOptions({option}) {
  return (
    <div className="product-options" key={option.name}>
      <h5 className="text-sm text-darkGray">{option.name}</h5>
      <div className="product-options-grid pt-2">
        {option.values.map(({value, isAvailable, isActive, to}) => {
          return (
            <Link
              className="product-options-item text-sm"
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              replace
              to={to}
              style={{
                border: isActive ? '1px solid black' : '1px solid transparent',
                opacity: isAvailable ? 1 : 0.3,
              }}
            >
              {value}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/**
 * @param {{
 *   analytics?: unknown;
 *   children: React.ReactNode;
 *   disabled?: boolean;
 *   lines: CartLineInput[];
 *   onClick?: () => void;
 * }}
 */
function AddToCartButton({analytics, children, disabled, lines, onClick}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
            className=" flex w-full items-center justify-center rounded-md border border-transparent bg-darkGray px-8 py-3 text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    hexValue: metafield(namespace: "custom", key: "hexvalue") {
      value
      type
    }
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    drop: metafield(namespace: "product_drop", key: "drop") {
      value
      type
    }
    descriptionHtml
    description
    options {
      name
      values
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
`;

const METAOBJECT_QUERY = `#graphql
query MetaObject(
  $id: ID
){
  metaobject(id: $id) {
    id
    fields {
      value
      key
    }
  }
}
`;
const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@remix-run/react').FetcherWithComponents} FetcherWithComponents */
/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */
/** @typedef {import('storefrontapi.generated').ProductVariantsQuery} ProductVariantsQuery */
/** @typedef {import('storefrontapi.generated').ProductVariantFragment} ProductVariantFragment */
/** @typedef {import('@shopify/hydrogen').VariantOption} VariantOption */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').CartLineInput} CartLineInput */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').SelectedOption} SelectedOption */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
