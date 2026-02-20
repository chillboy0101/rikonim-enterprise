import { defineEnableDraftMode } from 'next-sanity/draft-mode';
import { sanityNextClient } from '@/lib/sanityNextClient';

export const { GET } = defineEnableDraftMode({
  client: sanityNextClient.withConfig({
    token: process.env.SANITY_API_READ_TOKEN
  })
});
