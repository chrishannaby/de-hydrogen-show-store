import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'Hydrogen | Home'}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context}) {
  const {storefront} = context;

  const recommendedProducts = await storefront.query(
    COLLECTION_PRODUCTS_QUERY,
    {
      variables: {
        query: 'title:Bestsellers',
        limit: 5,
      },
    },
  );
  const productList2 = await storefront.query(COLLECTION_PRODUCTS_QUERY, {
    variables: {
      query: 'title:Beauty',
      limit: 2,
    },
  });

  const productList3 = await storefront.query(COLLECTION_PRODUCTS_QUERY, {
    variables: {
      query: 'title:Apparel',
      limit: 2,
    },
  });

  return defer({
    recommendedProducts,
    productList2,
    productList3,
  });
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  return (
    <div className="home">
      <Hero heroImage={data.heroImage} />
      <div className="page-width py-20">
        <CollectionProductGrid
          products={data.recommendedProducts.collections.edges[0].node}
        />

        <CollectionProductGridWithImage
          products={data.productList2.collections.edges[0].node}
          image="/images/sale_image.webp"
          sectionTitle="Beauty"
          sectionHeading="Shop all beauty products"
        />

        <CollectionCTASection />

        <div className="pt-24">
          <CollectionProductGridWithImage
            products={data.productList3.collections.edges[0].node}
            image="/images/summer-collection.webp"
            sectionTitle="Apparel"
            sectionHeading="Shop all beauty products"
          />
        </div>
      </div>
    </div>
  );
}

/**
 *
 */
function Hero() {
  return (
    <div className="max-h-[420px] overflow-hidden flex justify-center items-center">
      <img
        src="/images/hero.png"
        alt="hero"
        className="h-auto w-full object-cover object-center"
      />
    </div>
  );
}

function CollectionHeading({sectionName, sectionHeading, collectionHandle}) {
  return (
    <>
      <h2 className="text-3xl font-bold uppercase">{sectionName}</h2>
      <div>
        <Link
          className="flex items-center space-x-1"
          to={`/collections/${collectionHandle}`}
        >
          <div className="font-light text-sm"> {sectionHeading} </div>
          <div>
            <svg
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464466C7.97631 0.269204 7.65973 0.269204 7.46447 0.464466C7.2692 0.659728 7.2692 0.976311 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM0 4.5H11V3.5H0V4.5Z"
                fill="black"
              />
            </svg>
          </div>
        </Link>
      </div>
    </>
  );
}

/**
 * @param {{
 *   products: Promise<RecommendedProductsQuery>;
 * }}
 */
export function CollectionProductGrid({products, showHeader = true}) {
  return (
    <div className="recommended-products">
      {showHeader && (
        <CollectionHeading
          sectionName={'OUR BEST SELLERS'}
          sectionHeading={'Shop our top picks'}
          collectionHandle={products.handle}
        />
      )}

      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {({products}) => (
            <div className="recommended-products-grid py-6">
              {products.nodes.map((product) => (
                <Link
                  key={product.id}
                  className="recommended-product"
                  to={`/products/${product.handle}`}
                >
                  <Image
                    data={product.images.nodes[0]}
                    aspectRatio="1/1"
                    sizes="(min-width: 45em) 20vw, 50vw"
                  />
                  <h3 className="font-semibold text-lg pt-4">
                    {product.vendor}
                  </h3>
                  <h4 className="text-sm">{product.title}</h4>
                  <small>
                    <Money data={product.priceRange.minVariantPrice} />
                  </small>
                </Link>
              ))}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

/**
 * @param {{
 *   products: Promise<RecommendedProductsQuery>;
 * }}
 */
function CollectionCTASection({collectionHandle}) {
  return (
    <div className="grid grid-cols-12 space-x-12 pt-16">
      <div className="col-span-4 space-y-2">
        <h3 className="text-3xl font-bold uppercase">Electronics</h3>
        <p className="text-sm font-light">
          Are you tired of running out of battery on the go? Anker offers a
          fantastic range of powerful and innovative portable power banks that
          will supercharge your charging experience.
        </p>
        <div className="pt-4">
          <button
            type="button"
            className="rounded-full bg-darkGray px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Shop electronics
          </button>
        </div>
      </div>
      <div className="col-span-8">
        <img src="/images/electronics.png" alt="electronics" />
      </div>
    </div>
  );
}

/**
 * @param {{
 *   products: Promise<RecommendedProductsQuery>;
 * }}
 */
function CollectionProductGridWithImage({
  products,
  sectionTitle,
  sectionHeading,
  image,
}) {
  return (
    <div className="recommended-products">
      <CollectionHeading
        sectionName={sectionTitle}
        sectionHeading={sectionHeading}
        collectionHandle={products.handle}
      />
      <div className="grid grid-cols-12 space-x-12 pt-8">
        <div className="col-span-8 ">
          <img className="w-full h-auto" src={image} alt="beauty" />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <Await resolve={products}>
            {({products}) => (
              <div className="col-span-4 gap-y-12 grid">
                {products.nodes.map((product) => (
                  <Link
                    key={product.id}
                    className="recommended-product"
                    to={`/products/${product.handle}`}
                  >
                    <Image
                      data={product.images.nodes[0]}
                      aspectRatio="1/1"
                      sizes="(min-width: 45em) 20vw, 50vw"
                    />
                    <h3 className="font-semibold text-lg pt-4">
                      {product.vendor}
                    </h3>
                    <h4 className="text-sm">{product.title}</h4>
                    <small>
                      <Money data={product.priceRange.minVariantPrice} />
                    </small>
                  </Link>
                ))}
              </div>
            )}
          </Await>
        </Suspense>
      </div>

      <br />
    </div>
  );
}

const COLLECTION_PRODUCTS_QUERY = `#graphql
query COLLECTION(
  $query: String
  $limit: Int
){
  collections(first: 1,  query: $query) {
    edges {
      node {
        title
        handle
        products(first: $limit) {
          nodes {
                id
                title
                productType  
                vendor 
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
        }
      }
    }
  }
}
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
