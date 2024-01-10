import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  return [{title: `Hydrogen | ${data?.metaobject.name.value ?? ''}`}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({params, context}) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const {metaobject} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: {
        type: 'drop',
        handle: params.handle,
      },
    },
  });

  if (!metaobject) {
    throw new Response('Not Found', {status: 404});
  }

  return json({metaobject});
}

export default function Page() {
  /** @type {LoaderReturnData} */
  const {metaobject} = useLoaderData();

  return (
    <div className="page-width pt-12 pb-16">
      <header>
        <h1>{metaobject.name.value}</h1>
      </header>
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query Metaobject(
    $handle: MetaobjectHandleInput!
  ) {
    metaobject(handle: $handle) {
      id
      name: field(key: "name") {
        value
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
