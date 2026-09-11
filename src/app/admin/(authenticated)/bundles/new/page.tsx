import React from 'react';
import { Metadata } from 'next';
import AdminCreateBundleClient from './AdminCreateBundleClient';

export const metadata: Metadata = {
  title: 'Create Bundle | Alvora Admin',
};

export default function CreateBundlePage() {
  return <AdminCreateBundleClient />;
}