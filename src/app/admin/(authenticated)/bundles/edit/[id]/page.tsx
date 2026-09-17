import React from 'react';
import { Metadata } from 'next';
import AdminEditBundleClient from './AdminEditBundleClient';

export const metadata: Metadata = {
  title: 'Edit Bundle | Alvora Admin',
};

export default async function EditBundlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminEditBundleClient bundleId={id} />;
}
