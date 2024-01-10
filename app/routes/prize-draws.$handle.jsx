import {json} from '@shopify/remix-oxygen';
import {useLoaderData, Link, useFetcher} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/utils';

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  return [{title: `Hydrogen | ${data?.metaobject.name.value ?? ''}`}];
};

/**
 * @param {ActionFunctionArgs}
 */
export async function action({request, context}) {
  const {session, storefront} = context;

  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  try {
    const form = await request.formData();
    const id = String(form.has('id') ? form.get('id') : '');
    const email = String(form.has('email') ? form.get('email') : '');
    const accessCode = String(
      form.has('accessCode') ? form.get('accessCode') : '',
    );
    const validInputs = Boolean(id && email && accessCode);

    if (!validInputs) {
      throw new Error('Please provide both an email and an access code.');
    }

    await fetch(`${context.env.WEBHOOKS_URL}/registerForDraw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({drawId: id, email, secret: accessCode}),
    });
    const data = {status: 'success'};

    return json(data);
  } catch (error) {
    if (error instanceof Error) {
      return json({error: error.message}, {status: 400});
    }
    return json({error}, {status: 400});
  }
}

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({params, context, request}) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const url = new URL(request.url);
  const accessCode = url.searchParams.get('access_code');

  const {metaobject} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: {
        type: 'prize_draw',
        handle: params.handle,
      },
    },
  });

  if (!metaobject) {
    throw new Response('Not Found', {status: 404});
  }

  const {product} = await context.storefront.query(PRODUCT_QUERY, {
    variables: {
      id: metaobject.product.value,
    },
  });

  return json({metaobject, accessCode, product});
}

export default function Page() {
  /** @type {LoaderReturnData} */
  const {metaobject, accessCode, product} = useLoaderData();

  return (
    <>
      <Hero
        title={metaobject.name.value}
        startsAt={metaobject.start_time.value}
        id={metaobject.id}
        accessCode={accessCode}
      />
      <div className="page-width pt-12 pb-16">
        <div className="grid grid-cols-1 justify-center items-center">
          <ProductItem product={product} />
        </div>
      </div>
    </>
  );
}

function Hero({title, startsAt, id, accessCode}) {
  const fetcher = useFetcher();
  const isDone = fetcher.state === 'idle' && fetcher.data != null;

  const data = isDone ? fetcher.data : null;
  const success = data?.status === 'success';

  const startsAtDate = new Date(startsAt);
  const date = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: 'America/New_York',
  }).format(startsAtDate);

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 shadow-2xl sm:rounded-3xl sm:px-24 xl:py-32">
          <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-lg leading-8 text-gray-300">
            Draw starts at {date}
          </p>
          {accessCode && !success ? (
            <fetcher.Form
              method="post"
              className="mx-auto mt-10 flex max-w-md gap-x-4"
            >
              <input type="hidden" name="id" value={id} />
              <input type="hidden" name="accessCode" value={accessCode} />
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
                placeholder="Enter your email"
              />
              <button
                type="submit"
                className="flex-none rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Register
              </button>
            </fetcher.Form>
          ) : (
            accessCode && (
              <p className="mx-auto mt-2 max-w-xl text-center text-lg leading-8 text-gray-300">
                You've registered!
              </p>
            )
          )}
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2"
            aria-hidden="true"
          >
            <circle
              cx={512}
              cy={512}
              r={512}
              fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
              fillOpacity="0.7"
            />
            <defs>
              <radialGradient
                id="759c1415-0410-454c-8f7c-9a820de03641"
                cx={0}
                cy={0}
                r={1}
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(512 512) rotate(90) scale(512)"
              >
                <stop stopColor="#7775D6" />
                <stop offset={1} stopColor="#E935C1" stopOpacity={0} />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

/**
 * @param {{
 *   product: ProductItemFragment;
 *   loading?: 'eager' | 'lazy';
 * }}
 */
function ProductItem({product, loading}) {
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);
  return (
    <Link
      className="product-item w-72 place-self-center"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {product.featuredImage && (
        <Image
          alt={product.featuredImage.altText || product.title}
          data={product.featuredImage}
          loading={loading}
          sizes="(min-width: 45em) 400px, 100vw"
        />
      )}
      <h4>{product.title}</h4>
      <small>
        <Money data={product.priceRange.minVariantPrice} />
      </small>
    </Link>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 1) {
      nodes {
        selectedOptions {
          name
          value
        }
      }
    }
  }
`;

const PAGE_QUERY = `#graphql
  query DrawMetaobject(
    $handle: MetaobjectHandleInput!
  ) {
    metaobject(handle: $handle) {
      id
      name: field(key: "name") {
        value
      }
      start_time: field(key: "start_time") {
        value
      }
      product: field(key: "product") {
        value
      }
      numberAvailable: field(key: "number_available") {
        value
      }
    }
  }
`;

const PRODUCT_QUERY = `#graphql
  query getProductById($id: ID!) {
    product(id: $id) {
      ...ProductItem
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
