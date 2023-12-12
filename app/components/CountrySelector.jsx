import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import React from 'react';
import Select from 'react-select';
import SelectMenu from './SelectMenu';

const options = [
  {value: 'chocolate', label: 'Chocolate'},
  {value: 'strawberry', label: 'Strawberry'},
  {value: 'vanilla', label: 'Vanilla'},
];

/**
 * @param {FooterQuery & {shop: HeaderQuery['shop']}}
 */
export function CountrySelector() {
  return (
    <div className="">
      <SelectMenu />
    </div>
  );
}
