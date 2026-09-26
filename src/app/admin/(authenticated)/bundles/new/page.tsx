import React from 'react';
import { Metadata } from 'next';
import AdminCreateBundleClient from './AdminCreateBundleClient';

export const metadata: Metadata = {
  title: 'Create Bundle ',
};

export default function CreateBundlePage() {
  return <AdminCreateBundleClient />;
}