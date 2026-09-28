"use client";
import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { SeoHead } from '../../components/common/SeoHead';
import { RefreshCw, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function ReturnPolicyPage() {
  return (
    <div className="flex-1 bg-slate-50 font-sans py-8">
      <SeoHead title="Return Policy - Alvora Skincare" />

      {/* Match the Navbar & Footer max-width container strictly */}
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <Breadcrumbs items={[{ label: 'Return Policy' }]} />

        <div className="bg-white p-6 sm:p-10 lg:p-12 rounded-3xl border border-slate-100 shadow-sm mt-4">
          
          {/* Header Section */}
          <div className="text-center space-y-4 pb-12 border-b border-slate-100">
            <div className="w-20 h-20 rounded-3xl bg-[#FDF8F5] border border-[#F1C9BD] text-[#C48B80] flex items-center justify-center mx-auto mb-6 shadow-sm">
              <RefreshCw className="w-10 h-10" />
            </div>
            <h1 className="font-heading font-black text-3xl md:text-4xl text-slate-900">7-Day Happiness Guarantee</h1>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              We want you to love every product from Alvora Skincare. If you aren't completely delighted, we're here to help make it right.
            </p>
          </div>

          {/* Key Policy Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
            <div className="flex items-start gap-4">
              <div className="shrink-0 p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900 mb-2">7-Day Window</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  You have 7 days from the date of delivery to initiate a return or exchange for any eligible skincare products.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="shrink-0 p-3 bg-blue-100 text-blue-600 rounded-2xl">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900 mb-2">Original Condition</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  To qualify, items must be in their original packaging, unopened, unused, and in the same condition you received them.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="shrink-0 p-3 bg-rose-100 text-rose-600 rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900 mb-2">Damaged Items</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  If your order arrives damaged or defective, please contact us within 48 hours with photo evidence for a swift replacement.
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Policy Text */}
          <div className="max-w-4xl mx-auto space-y-10 border-t border-slate-100 pt-12">
            
            <section>
              <h2 className="text-2xl font-heading font-bold text-slate-900 mb-4">1. How to Initiate a Return</h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                To ensure a smooth and hassle-free return process, please follow these simple steps:
              </p>
              <ol className="list-decimal pl-5 space-y-3 text-slate-600 leading-relaxed">
                <li>Contact our customer support team at <strong className="text-slate-800">support@alvora.pk</strong> or via WhatsApp, providing your order number and reason for return.</li>
                <li>Wait for our team to approve your request. We will provide you with the exact return shipping address and instructions.</li>
                <li>Pack the items securely in their original packaging, ensuring they are well-protected for transit.</li>
                <li>Ship the package to the return address. Please note that return shipping costs are the responsibility of the customer unless the item arrived damaged.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-slate-900 mb-4">2. Non-Returnable Items</h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                For hygiene, safety, and quality control reasons, the following items cannot be returned or exchanged:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-600 leading-relaxed">
                <li>Skincare products that have been opened, unsealed, or used.</li>
                <li>Items purchased during a final clearance sale or flash sale event.</li>
                <li>Gift cards and promotional free items.</li>
                <li>Products returned without prior authorization from our support team.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-slate-900 mb-4">3. Refunds & Processing</h2>
              <p className="text-slate-600 leading-relaxed">
                Once we receive and physically inspect your returned item, we will notify you of the approval or rejection of your refund. If approved, the refund will be processed immediately, and a credit will automatically be applied to your original method of payment or bank account within <strong className="text-slate-800">5 to 7 business days</strong>. Please note that original shipping and handling fees are non-refundable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-slate-900 mb-4">4. Order Cancellations</h2>
              <p className="text-slate-600 leading-relaxed">
                Orders can only be cancelled before they are dispatched from our warehouse. Once an order has been handed over to our courier partners and is in transit, it cannot be cancelled. You may, however, refuse the delivery at your doorstep, but repeated refusals may result in restricted COD privileges for future orders.
              </p>
            </section>

            {/* Support Call-to-action */}
            <div className="bg-[#FDF8F5] p-8 sm:p-10 rounded-3xl border border-[#F1C9BD] mt-12 text-center">
              <h3 className="font-heading font-bold text-2xl text-[#C48B80] mb-3">Still have questions?</h3>
              <p className="text-[#C48B80]/80 mb-6 max-w-lg mx-auto">
                Our dedicated support team is here to assist you with any questions or concerns regarding your order.
              </p>
              <Link href="/contact" className="inline-block bg-[#C48B80] text-white px-10 py-4 rounded-xl font-bold tracking-widest uppercase hover:bg-[#a6746a] hover:scale-105 transition-all shadow-sm">
                Contact Support
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
